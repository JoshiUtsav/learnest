import type { ButtonProps } from "@/components/ui/button";

export interface BetaResponse {
  message: string;
  success: boolean;
  data?: string;
}

export interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean;
}
