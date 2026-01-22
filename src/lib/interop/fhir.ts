/**
 * FHIR R4 Resource Converters
 * Standardizing Medicore data models into HL7/FHIR resources.
 */

export const convertToFHIRPatient = (medicorePatient: any) => {
    return {
        resourceType: "Patient",
        id: medicorePatient.mrn,
        identifier: [
            {
                system: "http://yondermedicore.com/mrn",
                value: medicorePatient.mrn
            }
        ],
        name: [
            {
                use: "official",
                family: medicorePatient.lastName,
                given: [medicorePatient.firstName]
            }
        ],
        gender: medicorePatient.gender?.toLowerCase(),
        birthDate: medicorePatient.dob?.toISOString().split('T')[0],
        telecom: [
            {
                system: "phone",
                value: medicorePatient.contact?.phone,
                use: "home"
            },
            {
                system: "email",
                value: medicorePatient.contact?.email
            }
        ],
        address: [
            {
                line: [medicorePatient.contact?.address],
                type: "both"
            }
        ]
    };
};

export const convertToFHIREncounter = (medicoreEncounter: any) => {
    return {
        resourceType: "Encounter",
        id: medicoreEncounter._id,
        status: medicoreEncounter.status === 'completed' ? 'finished' : 'in-progress',
        class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory"
        },
        subject: {
            reference: `Patient/${medicoreEncounter.patientId?.mrn || medicoreEncounter.patientId}`
        },
        period: {
            start: medicoreEncounter.checkInTime,
            end: medicoreEncounter.checkOutTime
        },
        reasonCode: [
            {
                text: medicoreEncounter.chiefComplaint
            }
        ]
    };
};
