import { Container } from "@/components/shared/Container";
import { providerServices } from "@/features/service-provider-details/data/service-provider-details.mock";

export function ProviderPricingSection() {
  return (
    <section className="bg-surface py-12 sm:py-16 lg:py-20" aria-labelledby="pricing-heading">
      <Container>
        <div className="space-y-2">
          <h2 id="pricing-heading" className="font-inter text-[clamp(1.5rem,3vw,2rem)] font-bold text-brand-dark">
            Service & Pricing
          </h2>
          <p className="font-inter text-base text-brand-dark/80">
            Transparent pricing · No hidden charges
          </p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-brand-dark/10">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e8eaed] bg-brand-dark/10">
                <th className="w-[280px] px-5 py-4 font-inter text-xs font-bold uppercase text-brand-dark/80">
                  Service
                </th>
                <th className="px-5 py-4 font-inter text-xs font-bold uppercase text-brand-dark/80">
                  Description
                </th>
                <th className="w-[120px] px-5 py-4 font-inter text-xs font-bold uppercase text-brand-dark/80">
                  Duration
                </th>
                <th className="w-[150px] px-5 py-4 text-right font-inter text-xs font-bold uppercase text-brand-dark/80">
                  Price
                </th>
                <th className="w-[60px] px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {providerServices.map((service, index) => (
                <tr
                  key={service.id}
                  className={`border-b border-[#e8eaed] last:border-b-0 ${
                    index % 2 === 1 ? "bg-brand-dark/10" : "bg-white"
                  }`}
                >
                  <td className="px-5 py-5 font-jakarta text-[15px] font-bold text-brand-dark">
                    {service.name}
                  </td>
                  <td className="px-5 py-5 font-inter text-[15px] text-brand-dark/80">
                    {service.description}
                  </td>
                  <td className="px-5 py-5 font-inter text-sm text-brand-dark/80">{service.duration}</td>
                  <td className="px-5 py-5 text-right font-jakarta text-base font-bold text-brand-dark">
                    {service.priceLabel}
                  </td>
                  <td className="px-5 py-5 text-right">
                    <button
                      type="button"
                      className="font-jakarta text-[13px] font-bold text-brand-dark transition-opacity hover:opacity-70"
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 font-inter text-[13px] italic text-brand-dark/80">
          * Prices may vary based on complexity. Final quote confirmed on-site.
        </p>
      </Container>
    </section>
  );
}
