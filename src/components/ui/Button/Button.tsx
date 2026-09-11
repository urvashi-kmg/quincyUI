import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Variant/size values renamed to match Buttons.pdf 2.8 (breaking change from
 * the previous primary/secondary/danger/ghost + sm/md/lg API — see the token
 * migration report). `danger` has no equivalent in the spec and is kept
 * unchanged, alongside the five spec variants, by explicit decision.
 */
export type ButtonVariant =
  'purple' | 'pink' | 'gradient' | 'outlined-primary' | 'outlined-secondary' | 'danger';
export type ButtonSize = 'xl' | 'large' | 'm' | 'small' | 'x-small';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

interface VariantStyle {
  /** Default appearance plus real :hover/:active/:focus-visible pseudo-classes. */
  idle: string;
  /** Applied via the `disabled` prop (not the loading state — see below). */
  disabled: string;
  /** Applied via `isLoading`. Not expressible as a CSS pseudo-class, so this
   * one branch of the background/text choice is necessarily prop-driven; the
   * genuine interaction states above stay pure CSS per .claude/rules. */
  loading: string;
}

/**
 * Button border: Buttons.pdf's Global Properties give a single 2px border
 * for every size, and Colors.pdf gives one "Button Border Color" (82859E)
 * with no per-variant/per-state override anywhere in the spec — so it's
 * applied uniformly below via `border-line-button` on every variant. This is
 * an interpretation (the spec never ties a border color to a specific
 * state), flagged in the report.
 *
 * Focus drop-shadows: the spec gives each variant's shadow color/opacity but
 * never a blur or spread, so a 4px solid ring was chosen as the interpretation
 * of "drop-shadow" for a focus indicator — also flagged in the report. Per
 * the computed contrast audit, every one of these 30%-opacity rings fails
 * the WCAG 1.4.11 3:1 non-text minimum against a white/light surface — see
 * the report; implemented as specified regardless.
 */
const variantStyles: Record<ButtonVariant, VariantStyle> = {
  purple: {
    idle: 'bg-brand-purple text-white hover:bg-brand-purple-hover active:bg-brand-purple-active focus-visible:bg-brand-purple focus-visible:shadow-[0_0_0_4px_rgba(123,32,158,0.3)]',
    disabled: 'bg-brand-purple text-white opacity-60',
    loading: 'bg-brand-purple-active text-white',
  },
  pink: {
    idle: 'bg-brand-pink text-white hover:bg-brand-pink-hover active:bg-brand-pink-active focus-visible:bg-brand-pink focus-visible:shadow-[0_0_0_4px_rgba(255,56,123,0.3)]',
    // Spec-defect: disabled fill (671C84) is an off-brand purple, unlike
    // every other pink state — implemented literally, flagged in the report.
    disabled: 'bg-brand-pink-disabled text-white opacity-60',
    loading: 'bg-brand-pink-active text-white',
  },
  gradient: {
    idle: 'bg-gradient-button text-white hover:bg-none hover:bg-gradient-button-hover active:bg-gradient-button-active focus-visible:bg-gradient-button focus-visible:shadow-[0_0_0_4px_rgba(105,56,170,0.3)]',
    disabled: 'bg-gradient-button text-white opacity-60',
    loading: 'bg-gradient-button-active text-white',
  },
  'outlined-primary': {
    // Spec-defect placeholder: the spec's focus state is text 7B209E on bg
    // 7B209E — identical colors, a 1:1 contrast ratio, invisible label. Per
    // explicit decision, this uses text FFFFFF (matching every other state
    // in this variant) as a documented placeholder pending a design fix.
    idle: 'bg-white text-brand-purple hover:bg-brand-purple hover:text-white active:bg-brand-purple-hover active:text-white focus-visible:bg-brand-purple focus-visible:text-white focus-visible:shadow-[0_0_0_4px_rgba(123,32,158,0.3)]',
    disabled: 'bg-white text-brand-purple opacity-60',
    loading: 'bg-brand-purple-hover text-white',
  },
  'outlined-secondary': {
    idle: 'bg-white text-ink-primary hover:text-brand-purple active:bg-outlined-secondary-active active:text-brand-purple focus-visible:bg-outlined-secondary-active focus-visible:text-brand-purple focus-visible:shadow-[0_0_0_4px_rgba(123,32,158,0.3)]',
    disabled: 'bg-white text-ink-primary opacity-60',
    loading: 'bg-outlined-secondary-loading text-white',
  },
  // No equivalent in the design spec — kept exactly as it was before this
  // change, by explicit decision, until design specifies a destructive-action
  // treatment.
  danger: {
    idle: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600',
    disabled: 'bg-red-600 text-white opacity-60',
    loading: 'bg-red-700 text-white',
  },
};

/**
 * Sizes per Buttons.pdf 2.7, applied as literal padding/line-height/border
 * (box-sizing: border-box, set by Tailwind's preflight) rather than a pinned
 * height. For M and X-Small this computes to 40px/30px, not the spec's
 * stated 44px/32px — the two don't reconcile, and the padding arithmetic was
 * designated authoritative over the stated height. See the report's
 * reconciliation table.
 */
const sizeStyles: Record<ButtonSize, string> = {
  xl: 'text-[20px] leading-[28px] font-bold py-2 px-6',
  large: 'text-[18px] leading-[26px] font-bold py-[7px] px-6',
  m: 'text-[16px] leading-[24px] font-semibold py-[6px] px-[22px]',
  small: 'text-[14px] leading-[20px] font-semibold py-[6px] px-4',
  'x-small': 'text-[12px] leading-[16px] font-semibold py-[5px] px-3',
};

/**
 * Shared, presentational button — reuse this before creating a new one.
 * See .claude/rules/components.md and .claude/skills/storybook-design-system.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'purple',
    size = 'm',
    isLoading = false,
    disabled = false,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const style = variantStyles[variant];
  const stateClasses = isLoading ? style.loading : disabled ? style.disabled : style.idle;

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-card border-2 border-line-button transition-colors disabled:cursor-not-allowed ${sizeStyles[size]} ${stateClasses} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loader2
            className="animate-spin motion-reduce:animate-none"
            size={16}
            aria-hidden="true"
          />
          {/* Accessible name is preserved for assistive tech even though the
           * label is visually hidden while loading — see Buttons.pdf 2.8
           * ("Loading ... spinner, no label") and .claude/rules/accessibility.md. */}
          <span className="sr-only">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});
