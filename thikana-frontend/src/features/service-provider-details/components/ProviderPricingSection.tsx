import { Container } from "@/components/shared/Container";

type PricingItem = {
  id: string;
  name: string;
  priceBdt: number;
};

type ProviderPricingSectionProps = {
  pricingItems: PricingItem[];
};

export function ProviderPricingSection({
  pricingItems,
}: ProviderPricingSectionProps) {
  return (
    <section
      className="bg-surface py-12 sm:py-16 lg:py-20"
      aria-labelledby="pricing-heading"
    >
      <Container>
        <div className="space-y-2">
          <h2
            id="pricing-heading"
            className="font-inter text-[clamp(1.5rem,3vw,2rem)] font-bold text-brand-dark"
          >
            Service & Pricing
          </h2>
          <p className="font-inter text-base text-brand-dark/80">
            Transparent pricing · No hidden charges
          </p>
        </div>

        {pricingItems.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-[#e8eaed] bg-white p-8 font-inter text-sm text-brand-dark/60">
            This provider has not published a pricing list yet. Request a quote
            when you book.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-brand-dark/10">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e8eaed] bg-brand-dark/10">
                  <th className="px-5 py-4 font-inter text-xs font-bold uppercase text-brand-dark/80">
                    Service
                  </th>
                  <th className="w-[180px] px-5 py-4 text-right font-inter text-xs font-bold uppercase text-brand-dark/80">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricingItems.map((service, index) => (
                  <tr
                    key={service.id}
                    className={`border-b border-[#e8eaed] last:border-b-0 ${
                      index % 2 === 1 ? "bg-brand-dark/10" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-5 font-jakarta text-[15px] font-bold text-brand-dark">
                      {service.name}
                    </td>
                    <td className="px-5 py-5 text-right font-jakarta text-base font-bold text-brand-dark">
                      ৳
                      {new Intl.NumberFormat("en-US").format(
                        Math.round(service.priceBdt)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 font-inter text-[13px] italic text-brand-dark/80">
          * Prices may vary based on complexity. Final quote confirmed on-site.
        </p>
      </Container>
    </section>
  );
}
