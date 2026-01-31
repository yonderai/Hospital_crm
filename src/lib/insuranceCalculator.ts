
export interface InsurancePolicy {
    sumInsured: number;
    coPayment: number; // percentage (0-100) or flat amount logic? Assumption: percentage for usually, but schema said number. Let's assume percentage for coInsurance, flat for coPay.
    // Schema says: coPayment: { type: Number }, coInsurancePercentage: { type: Number }, deductible: { type: Number }
    deductible: number;
    coInsurancePercentage: number;
    coverageType: string;
}

export interface BillableItem {
    cost: number;
    isInsuranceCovered: boolean;
}

export interface CalculationResult {
    totalBillAmount: number;
    insuranceCoveredAmount: number;
    totalInsurancePayable: number;
    totalPatientPayable: number;
    breakdown: {
        deductibleApplied: number;
        coPayApplied: number;
        coInsuranceApplied: number;
        baseInsuranceAmount: number;
    }
}

/**
 * Calculates the insurance vs patient split for a given bill.
 * 
 * Logic:
 * 1. Calculate Total Bill.
 * 2. Separate covered vs non-covered items.
 * 3. On covered amount:
 *    a. Apply Deductible (Patient pays first X amount).
 *    b. Apply Co-Payment (Fixed fee patient pays).
 *    c. Apply Co-Insurance (Percentage split of remaining).
 * 4. Check Sum Insured limit (Cap insurance payment).
 * 5. Everything else is Patient Payable.
 */
export function calculateInsuranceSplit(
    items: BillableItem[],
    policy: InsurancePolicy,
    previousClaimsTotal: number = 0 // Amount already used from sum insured
): CalculationResult {
    const totalBillAmount = items.reduce((sum, item) => sum + item.cost, 0);

    // 1. Identify Covered Amount
    const totalCoveredItemsCost = items
        .filter(item => item.isInsuranceCovered)
        .reduce((sum, item) => sum + item.cost, 0);

    const nonCoveredAmount = totalBillAmount - totalCoveredItemsCost;

    let remainingCoveredAmount = totalCoveredItemsCost;
    let patientPayableForCovered = 0;

    // 2. Apply Deductible
    // Deductible is annual usually. Assuming 'policy.deductible' is the remaining deductible for this year or we treat it as per claim (simplified).
    // Let's assume policy.deductible is the *policy limit*, and we don't track remaining here without external state. 
    // For this implementation, we will assume the passed 'deductible' is what needs to be paid NOW (i.e. remaining deductible).
    const deductibleToPay = Math.min(remainingCoveredAmount, policy.deductible);
    patientPayableForCovered += deductibleToPay;
    remainingCoveredAmount -= deductibleToPay;

    // 3. Apply Co-Payment (Flat fee per visit/claim)
    // Only apply if there is still a claimable amount or just apply it? Usually applies if visit happens.
    // Let's apply if covered amount > 0
    let coPayToPay = 0;
    if (totalCoveredItemsCost > 0) {
        coPayToPay = policy.coPayment || 0;
        // If coPay exceeds remaining, cap it (though usually co-pay is paid regardless, but effectively it reduces insurance burden)
        // Insurance pays = Cost - Deductible - CoPay - CoInsurance.
        // If result < 0, patient pays full cost.
        if (coPayToPay > remainingCoveredAmount) {
            coPayToPay = remainingCoveredAmount;
        }
        patientPayableForCovered += coPayToPay;
        remainingCoveredAmount -= coPayToPay;
    }

    // 4. Apply Co-Insurance (Percentage patient pays)
    let coInsuranceToPay = 0;
    if (remainingCoveredAmount > 0 && policy.coInsurancePercentage > 0) {
        coInsuranceToPay = remainingCoveredAmount * (policy.coInsurancePercentage / 100);
        patientPayableForCovered += coInsuranceToPay;
        remainingCoveredAmount -= coInsuranceToPay;
    }

    // 5. Check Sum Insured Limit
    const availableSumInsured = Math.max(0, policy.sumInsured - previousClaimsTotal);
    let finalInsurancePayable = remainingCoveredAmount;

    if (finalInsurancePayable > availableSumInsured) {
        const excess = finalInsurancePayable - availableSumInsured;
        finalInsurancePayable = availableSumInsured;
        patientPayableForCovered += excess;
    }

    const totalPatientPayable = nonCoveredAmount + patientPayableForCovered;

    return {
        totalBillAmount,
        insuranceCoveredAmount: totalCoveredItemsCost,
        totalInsurancePayable: Math.max(0, finalInsurancePayable),
        totalPatientPayable: Math.max(0, totalPatientPayable),
        breakdown: {
            deductibleApplied: deductibleToPay,
            coPayApplied: coPayToPay,
            coInsuranceApplied: coInsuranceToPay,
            baseInsuranceAmount: finalInsurancePayable // This is essentially totalInsurancePayable
        }
    };
}
