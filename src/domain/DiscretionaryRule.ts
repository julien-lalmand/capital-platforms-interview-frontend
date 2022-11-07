import Consultant from "./Consultant";
import Customer from "./Customer";

class DiscretionaryRule {
    id!: number;
    consultant!: Consultant;
    consultantId!: number;
    customer!: Customer;
    customerId!: number;
    customerBuy!: boolean;
    customerSell!: boolean;
    consultantBuy!: boolean;
    consultantSell!: boolean;
}

export default DiscretionaryRule;