import { ApartmentModel } from "@/models/ApartmentModel";

export const calculateReservationTotal = (
    startDate: Date,
    endDate: Date,
    apartments: ApartmentModel[]
): number => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 0;

    const rawTotal = apartments.reduce((acc, apartment) => {
        const pricePerDay = Number(apartment.pricePerDay);
        let discount = 0;

        if (apartment.promotion) {
            const promoValue = Number(apartment.promotion.value);

            if (apartment.promotion.type === 'PERCENTAGE') {
                discount = (pricePerDay * promoValue) / 100;
            } else {
                discount = promoValue;
            }
        }

        const finalPricePerDay = Math.max(0, pricePerDay - discount);
        return acc + finalPricePerDay * diffDays;
    }, 0);

    return Math.round(rawTotal * 100) / 100;
};
