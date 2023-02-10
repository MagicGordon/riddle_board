module riddle_board::board {
    use std::string::{Self, String};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::balance::{Balance};
    use sui::object::{Self, UID};
    use sui::table::{Self, Table};
    use sui::sui::SUI;
    use sui::tx_context::{Self, TxContext};
    use sui::groth16;

    const ECommitmentAlreadyExist: u64 = 0;
    const ECommitmentNotExist: u64 = 1;
    const EProofMismatch: u64 = 2;

    struct Board has key {
        id: UID,
        circuit_type: String,
        record: Table<Commitment, Balance<SUI>>,
        verifying_key: vector<u8>
    }

    struct Commitment has copy, drop, store {
        data: vector<u8>
    }

    // Each puzzle board corresponds to a set of circuits
    public entry fun create_board(circuit_type: vector<u8>, verifying_key: vector<u8>, ctx: &mut TxContext) {
        transfer::share_object(Board {
            id: object::new(ctx),
            circuit_type: string::utf8(circuit_type),
            record: table::new(ctx),
            verifying_key
        });
    }

    // Each puzzle answer is a zero-knowledge proof commitment
    public entry fun add_riddle(board: &mut Board, commitment_bytes: vector<u8>, reward: Coin<SUI>) {
        let key = Commitment { data: commitment_bytes };
        assert!(!table::contains(&board.record, key), ECommitmentAlreadyExist);
        table::add(&mut board.record, key, coin::into_balance(reward));
    }

    // Prove that you know the answer to the riddle, because this is an easy starter demo, so there is more than one answer
    public entry fun answer(board: &mut Board, commitment_bytes: vector<u8>, proof_bytes: vector<u8>, ctx: &mut TxContext) {
        let key = Commitment { data: commitment_bytes };
        assert!(table::contains(&board.record, key), ECommitmentNotExist);
        
        let pvk = groth16::prepare_verifying_key(&board.verifying_key);
        let inputs = groth16::public_proof_inputs_from_bytes(commitment_bytes);
        let proof = groth16::proof_points_from_bytes(proof_bytes);
        assert!(groth16::verify_groth16_proof(&pvk, &inputs, &proof), EProofMismatch);
        
        let reward = table::remove(&mut board.record, key);
        transfer::transfer(coin::from_balance(reward, ctx), tx_context::sender(ctx));
    }
}

#[test_only]
module riddle_board::board_test {
    use riddle_board::board::{Self, Board};
    use sui::test_scenario;
    use sui::coin::{Self};
    use sui::sui::SUI;

    #[test]
    fun test_base() {
        let owner = @0x1;
        let user = @0x2;

        let verifying_key = x"15515e7e81bfbc7b632d61c4929e79606a673ee7d84fefe47ace9b532f1f70b84f1956d6ff336018b959760743a95102ec191231a362a11d08118e31b47b861825898397a40b3c422a8dd7fee29d1e9afd59cb01f236c3f6e499dc7bbd87451532168b2a84a89a4c4769abd9186e41ff541a0123986844501a1e29d989957abc3ef88b0611e7e3a03c7c75762bc8988a0ccfe9418d312a4f09ccebdeee69d4ae4f819016e1de80d18a4c89ce78594b0b11fa0be3bb8778c3512c4d1013bcfa0a699de3a1e38285e8015ed8e735034f7924660bfb9da7b539728b1d36d33ab36da43cb13eadeb871bfc461215378dc28de1ad0acfbda8d5f5f21cfdbb1403a4b499c3d1627a4d9182bcb7669111c7406bf6619002f4597741c1c0e78b8f68c60345a9ff2f07500532d55f2e0c93c03804fadcbde1dc68e8fb9676f757808e29204b91c298c2b10fad025073f22eafc09902000000000000004993f3c99a69fcacd71842a127c060f541e7b8c43ded23105dead597a44792b7a3050f779da8d8833ff4c547cdc88c861289b6ffd2f687f50d5f28396b98d3caafbc6bc5628a983449e1900e250041fa3234c54ed8a716478c0808d31c4c7511";
        let scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;
        test_scenario::next_tx(scenario, owner);
        {
            board::create_board(b"add", verifying_key, test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, user);
        {
            let share_board_val = test_scenario::take_shared<Board>(scenario);
            let share_board = &mut share_board_val;
            let ctx = test_scenario::ctx(scenario);
            board::add_riddle(
                share_board,
                x"0800000000000000000000000000000000000000000000000000000000000000",
                coin::mint_for_testing<SUI>(10, ctx)
            );
            test_scenario::return_shared(share_board_val);
        };

        test_scenario::next_tx(scenario, user);
        {
            let share_board_val = test_scenario::take_shared<Board>(scenario);
            let share_board = &mut share_board_val;
            let ctx = test_scenario::ctx(scenario);
            board::answer(
                share_board,
                x"0800000000000000000000000000000000000000000000000000000000000000",
                x"a281143dae731a10c431d0c799d0eaaf6a988d0054475d39559b376f499530cea39bc81d46c619b3c2fc3043d14a8004ace4ef74dfc36a13ed06caaf26b0e805312624091b42891da7670bf0ef8d81d6fb8fe911180f8dbf891185a9a410d1050e80c1aa0693d188905f91cb04c45a9b33710e6e62238dfe27ebfa90e3b4dadfd4cee81890423758fe01a0fab723060fcf90bbd3ad0f9fae2755df0495277d3544d5a8bb2c113749e40d16feca230f2f8327ae9eb94e2eaffb908922e7ea9a15",
                ctx
            );
            test_scenario::return_shared(share_board_val);
        };
        test_scenario::end(scenario_val);
    }
}