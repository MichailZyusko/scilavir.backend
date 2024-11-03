export type TOrderDetails = {
    buyerType: 'physical' | 'legal';
    deliveryType: 'post' | 'pickup' | 'courier';
    postCompany?: 'belpochta' | 'europochta';
    address: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
    paymentType: 'cash' | 'card' | 'account';
};
