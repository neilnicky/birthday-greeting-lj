import config from '../data/config';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Scene } from '../components/Stage/Stage';
import { Coupon } from '../components/Cards/Coupon';

// Passes all coupon fields through.
export function CouponSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const c = config.coupon;

  return (
    <Scene id="coupon" ariaLabel={c.ariaLabel} sectionRef={ref}>
      <Coupon
        title={c.title}
        forLine={c.forLine}
        usesLabel={c.usesLabel}
        usesValue={c.usesValue}
        expiryLabel={c.expiryLabel}
        expiryValue={c.expiryValue}
        isVisible={isVisible}
      />
    </Scene>
  );
}
