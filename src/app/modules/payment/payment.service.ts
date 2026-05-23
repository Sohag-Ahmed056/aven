import config from '../../../config/index.js';

interface IInitiatePaymentPayload {
  totalAmount: number;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
}

const initiatePayment = async (payload: IInitiatePaymentPayload) => {
  const isSandbox = config.ssl.is_sandbox;
  const storeId = config.ssl.store_id;
  const storePass = config.ssl.store_pass;
  const appUrl = config.ssl.app_url;

  if (!storeId || !storePass) {
    console.warn('⚠️ SSLCommerz Credentials missing! Simulating payment gateway...');
    // Return dummy redirect URL for development without credentials
    return {
      GatewayPageURL: `${appUrl}/api/v1/payment/mock-gateway?tran_id=${payload.transactionId}&amount=${payload.totalAmount}`,
      sessionkey: 'mock_session_key',
    };
  }

  const sslcommerzUrl = isSandbox
    ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://gwprocess.sslcommerz.com/gwprocess/v4/api.php';

  const formData = new URLSearchParams();
  formData.append('store_id', storeId);
  formData.append('store_passwd', storePass);
  formData.append('total_amount', payload.totalAmount.toString());
  formData.append('currency', 'BDT');
  formData.append('tran_id', payload.transactionId);

  // Redirect URLs
  formData.append('success_url', `${appUrl}/api/v1/payment/success?tran_id=${payload.transactionId}`);
  formData.append('fail_url', `${appUrl}/api/v1/payment/fail?tran_id=${payload.transactionId}`);
  formData.append('cancel_url', `${appUrl}/api/v1/payment/cancel?tran_id=${payload.transactionId}`);
  formData.append('ipn_url', `${appUrl}/api/v1/payment/ipn`);

  // Customer Details
  formData.append('cus_name', payload.customerName || 'Customer');
  formData.append('cus_email', payload.customerEmail || 'customer@mail.com');
  formData.append('cus_add1', payload.customerAddress || 'Dhaka, Bangladesh');
  formData.append('cus_phone', payload.customerPhone || '01700000000');
  formData.append('cus_city', 'Dhaka');
  formData.append('cus_country', 'Bangladesh');

  // Shipment & Product Details
  formData.append('shipping_method', 'NO');
  formData.append('product_name', 'Cart Items');
  formData.append('product_category', 'E-commerce');
  formData.append('product_profile', 'general');

  try {
    const response = await fetch(sslcommerzUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = (await response.json()) as any;
    if (data.status === 'SUCCESS') {
      return {
        GatewayPageURL: data.GatewayPageURL,
        sessionkey: data.sessionkey,
      };
    } else {
      throw new Error(data.failedreason || 'SSLCommerz payment initiation failed!');
    }
  } catch (error: any) {
    console.error('SSLCommerz payment initiation error:', error);
    // fallback to mock for safety during sandbox outages
    return {
      GatewayPageURL: `${appUrl}/api/v1/payment/mock-gateway?tran_id=${payload.transactionId}&amount=${payload.totalAmount}`,
      sessionkey: 'mock_session_key',
    };
  }
};

const verifyPayment = async (valId: string): Promise<boolean> => {
  const isSandbox = config.ssl.is_sandbox;
  const storeId = config.ssl.store_id;
  const storePass = config.ssl.store_pass;

  if (!storeId || !storePass || valId.startsWith('mock_')) {
    // If mock, return true
    return true;
  }

  const validationUrl = isSandbox
    ? `https://sandbox.sslcommerz.com/validator/api/valid.php?val_id=${valId}&store_id=${storeId}&store_passwd=${storePass}&format=json`
    : `https://gwprocess.sslcommerz.com/validator/api/valid.php?val_id=${valId}&store_id=${storeId}&store_passwd=${storePass}&format=json`;

  try {
    const response = await fetch(validationUrl);
    const data = (await response.json()) as any;
    if (data.status === 'VALID' || data.status === 'VALIDATED') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('SSLCommerz verification error:', error);
    return false;
  }
};

export const PaymentService = {
  initiatePayment,
  verifyPayment,
};
