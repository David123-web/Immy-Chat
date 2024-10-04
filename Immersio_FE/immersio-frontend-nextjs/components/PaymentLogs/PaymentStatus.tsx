interface IPaymentStatus {
	status: 'success' | 'error';
}

function PaymentStatus(props: IPaymentStatus) {
	const { status } = props;
	return (
		<div
			className={`tw-rounded-3xl tw-my-1 tw-text-center color-theme-7 ${
				status === 'success' ? 'bg-theme-4' : 'tw-bg-deleteIconDavidIconDavid'
			}`}
		>
			{status}
		</div>
	);
}

export default PaymentStatus;
