# Build and publish

Make sure your sui client is up to date!

```shell
sui move build
sui client gas 
sui client publish ./ --gas <gas_object_id> --gas-budget 30000
```

# Example
call create_board with verifying_key
```shell
sui client call --function create_board --module riddle_board --package <package_id> --args <circuit_type, a string desc, like: "add circuit board"> 0x15515e7e81bfbc7b632d61c4929e79606a673ee7d84fefe47ace9b532f1f70b84f1956d6ff336018b959760743a95102ec191231a362a11d08118e31b47b861825898397a40b3c422a8dd7fee29d1e9afd59cb01f236c3f6e499dc7bbd87451532168b2a84a89a4c4769abd9186e41ff541a0123986844501a1e29d989957abc3ef88b0611e7e3a03c7c75762bc8988a0ccfe9418d312a4f09ccebdeee69d4ae4f819016e1de80d18a4c89ce78594b0b11fa0be3bb8778c3512c4d1013bcfa0a699de3a1e38285e8015ed8e735034f7924660bfb9da7b539728b1d36d33ab36da43cb13eadeb871bfc461215378dc28de1ad0acfbda8d5f5f21cfdbb1403a4b499c3d1627a4d9182bcb7669111c7406bf6619002f4597741c1c0e78b8f68c60345a9ff2f07500532d55f2e0c93c03804fadcbde1dc68e8fb9676f757808e29204b91c298c2b10fad025073f22eafc09902000000000000004993f3c99a69fcacd71842a127c060f541e7b8c43ded23105dead597a44792b7a3050f779da8d8833ff4c547cdc88c861289b6ffd2f687f50d5f28396b98d3caafbc6bc5628a983449e1900e250041fa3234c54ed8a716478c0808d31c4c7511 --gas <gas_object_id> --gas-budget 30000
```

call add_riddle with commitment and reward
```shell
sui client call --function add_riddle --module riddle_board --package <package_id> --args <board_id> 0x0800000000000000000000000000000000000000000000000000000000000000 <reward_id> --gas <gas_object_id> --gas-budget 30000
```

call answer with commitment and proof, If successful, you can check the reward with the `sui client gas` command
```shell
sui client call --function answer --module riddle_board --package <package_id> --args <board_id> 0x0800000000000000000000000000000000000000000000000000000000000000 0xa281143dae731a10c431d0c799d0eaaf6a988d0054475d39559b376f499530cea39bc81d46c619b3c2fc3043d14a8004ace4ef74dfc36a13ed06caaf26b0e805312624091b42891da7670bf0ef8d81d6fb8fe911180f8dbf891185a9a410d1050e80c1aa0693d188905f91cb04c45a9b33710e6e62238dfe27ebfa90e3b4dadfd4cee81890423758fe01a0fab723060fcf90bbd3ad0f9fae2755df0495277d3544d5a8bb2c113749e40d16feca230f2f8327ae9eb94e2eaffb908922e7ea9a15 --gas <gas_object_id> --gas-budget 30000
```
