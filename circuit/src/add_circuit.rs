use crate::*;

pub struct Add<F: PrimeField> {
    pub lvalue: Option<F>,
    pub rvalue: Option<F>,
    pub commitment: Option<F>,
}

impl<F: PrimeField> ConstraintSynthesizer<F> for Add<F> {
    fn generate_constraints(self, cs: ConstraintSystemRef<F>) -> Result<(), SynthesisError> {

        let commitment = cs.new_input_variable(|| self.commitment.ok_or(SynthesisError::AssignmentMissing))?;
        
        let lvalue = AllocatedFp::new(
            self.lvalue, 
            cs.new_witness_variable(|| self.lvalue.ok_or(SynthesisError::AssignmentMissing))?, 
            ns!(cs, "lvalue").cs()
        );
        let rvalue = AllocatedFp::new(
            self.rvalue, 
            cs.new_witness_variable(|| self.rvalue.ok_or(SynthesisError::AssignmentMissing))?, 
            ns!(cs, "rvalue").cs()
        );
        cs.enforce_constraint(
            lc!() + lvalue.add(&rvalue).variable,
            lc!() + Variable::One,
            lc!() + commitment,
        )?;
        
        Ok(())
    }
}