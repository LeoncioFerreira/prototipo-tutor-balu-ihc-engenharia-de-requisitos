import type { ButtonHTMLAttributes, MouseEvent, ReactNode, RefObject } from "react";

type PetDetailsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  asSpan?: boolean;
  href?: string;
  anchorRef?: RefObject<HTMLAnchorElement>;
};

export function PetDetailsButton({
  asSpan = false,
  children = "Ver detalhes",
  className = "",
  href,
  anchorRef,
  ...buttonProps
}: PetDetailsButtonProps) {
  const classes = `pet-details-button ${className}`.trim();

  if (asSpan) return <span className={classes}>{children}</span>;

  if (href) {
    return (
      <a
        ref={anchorRef}
        href={href}
        className={classes}
        onClick={(event) =>
          buttonProps.onClick?.(event as unknown as MouseEvent<HTMLButtonElement>)
        }
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
