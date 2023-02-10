use ark_bls12_381::{Bls12_381, Fr};
use ark_ff::PrimeField;
use ark_serialize::CanonicalSerialize;
use ark_groth16::{
    create_random_proof, generate_random_parameters, prepare_verifying_key, verify_proof
};
use ark_relations::{
    lc, ns,
    r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError, Variable},
};
use ark_r1cs_std::fields::fp::AllocatedFp;
use ark_std::{test_rng, vec::Vec};

mod add_circuit;
mod mul_circuit;
use crate::add_circuit::*;
use crate::mul_circuit::*;

fn main() {
    let circuit_type = std::env::args().nth(1).expect("no circuit_type");
    let lvalue = std::env::args().nth(2).expect("no lvalue").parse::<u64>().expect("lvalue input need u64");
    let rvalue = std::env::args().nth(3).expect("no rvalue").parse::<u64>().expect("rvalue input need u64");
    let commitment = std::env::args().nth(4).expect("no result").parse::<u64>().expect("result input need u64");

    match circuit_type.as_str() {
        "add" => {
            println!("process_add");
            process_add(lvalue, rvalue, commitment);
        },
        "mul" => {
            println!("process_mul");
            process_mul(lvalue, rvalue, commitment);
            
        },
        _ => panic!("invalid circuit type, just support add or mul")
    };
}

fn process_add(lvalue: u64, rvalue: u64, commitment: u64){
    let rng = &mut test_rng();
    let params = {
        let c = Add::<Fr> {
            lvalue: None,
            rvalue: None,
            commitment: None,
        };

        generate_random_parameters::<Bls12_381, _, _>(c, rng).unwrap()
    };

    let pvk = prepare_verifying_key(&params.vk);
    let mut verifying_key_bytes = vec![];
    params.vk.serialize(&mut verifying_key_bytes).unwrap();
    
    let verifying_key_string = format!("{:02x?}", verifying_key_bytes);
    let verifying_key_vec: Vec<&str> = verifying_key_string.strip_prefix("[").unwrap().strip_suffix("]").unwrap().split(", ").collect();
    println!("");
    println!("verifying_key:");
    println!("{:?}", verifying_key_vec.join(""));
    println!("Creating proofs...");

    let commitment = Fr::from(commitment);
    let c = Add {
        lvalue: Some(Fr::from(lvalue)),
        rvalue: Some(Fr::from(rvalue)),
        commitment: Some(commitment),
    };
    
    let proof = create_random_proof(c, &params, rng).unwrap();
    let mut proof_bytes = vec![];
    proof.serialize(&mut proof_bytes).unwrap();
    let proof_string = format!("{:02x?}", proof_bytes);
    println!("");
    println!("proof:");
    let proof_vec: Vec<&str> = proof_string.strip_prefix("[").unwrap().strip_suffix("]").unwrap().split(", ").collect();
    println!("{:?}", proof_vec.join(""));

    let mut commitment_bytes = vec![];
    commitment.serialize(&mut commitment_bytes).unwrap();
    let commitment_string = format!("{:02x?}", commitment_bytes);
    let commitment_vec: Vec<&str> = commitment_string.strip_prefix("[").unwrap().strip_suffix("]").unwrap().split(", ").collect();
    println!("");
    println!("commitment:");
    println!("{:?}", commitment_vec.join(""));
    assert!(verify_proof(&pvk, &proof, &[commitment]).unwrap());
}

fn process_mul(lvalue: u64, rvalue: u64, commitment: u64){
    let rng = &mut test_rng();
    let params = {
        let c = Mul::<Fr> {
            lvalue: None,
            rvalue: None,
            commitment: None,
        };

        generate_random_parameters::<Bls12_381, _, _>(c, rng).unwrap()
    };

    let pvk = prepare_verifying_key(&params.vk);
    let mut verifying_key_bytes = vec![];
    params.vk.serialize(&mut verifying_key_bytes).unwrap();
    
    let verifying_key_string = format!("{:02x?}", verifying_key_bytes);
    let verifying_key_vec: Vec<&str> = verifying_key_string.strip_prefix("[").unwrap().strip_suffix("]").unwrap().split(", ").collect();
    println!("");
    println!("verifying_key:");
    println!("{:?}", verifying_key_vec.join(""));
    println!("Creating proofs...");

    let commitment = Fr::from(commitment);
    let c = Mul {
        lvalue: Some(Fr::from(lvalue)),
        rvalue: Some(Fr::from(rvalue)),
        commitment: Some(commitment),
    };

    let proof = create_random_proof(c, &params, rng).unwrap();
    let mut proof_bytes = vec![];
    proof.serialize(&mut proof_bytes).unwrap();
    let proof_string = format!("{:02x?}", proof_bytes);
    println!("");
    println!("proof:");
    let proof_vec: Vec<&str> = proof_string.strip_prefix("[").unwrap().strip_suffix("]").unwrap().split(", ").collect();
    println!("{:?}", proof_vec.join(""));

    let mut commitment_bytes = vec![];
    commitment.serialize(&mut commitment_bytes).unwrap();
    let commitment_string = format!("{:02x?}", commitment_bytes);
    let commitment_vec: Vec<&str> = commitment_string.strip_prefix("[").unwrap().strip_suffix("]").unwrap().split(", ").collect();
    println!("");
    println!("commitment:");
    println!("{:?}", commitment_vec.join(""));
    assert!(verify_proof(&pvk, &proof, &[commitment]).unwrap());
}
