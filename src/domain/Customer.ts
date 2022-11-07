import Consultant from "./Consultant";

class Customer {
    id!: number;
    consultant!: Consultant;
    consultantId!: number;
    firstName!: string;
    lastName!: string;
    address!: string;
    gender!: string;
    dob!: Date;
    mobileNo!: string;
    emailAddress!: string;
}

export default Customer;