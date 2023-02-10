# Riddle Board —— zk demo based on sui groth16

In total, there are three parts：

- [circuit/README.md](circuit): Provide two simple circuits (similar to hello world) with potentially multiple solutions for each commitment.

- [contract/README.md](contract): Support for arbitrarily many circuits vk, as well as commitment. Each commitment has a corresponding reward, which is earned by providing the correct proof.

- [frontend/README.md](frontend): verifying_key, proof, commitment are generated through the circuit module command line, and then interact with the sui contract through the frontend module.
