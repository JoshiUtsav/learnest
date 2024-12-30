"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, ArrowRight, Users, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendPostRequest } from "@/utils/api";
import { validateEmail } from "@/lib/validate";
import { fadeIn, slideUp, scaleIn } from "@/lib/animation";
import type { BetaResponse, AnimatedButtonProps } from "@/types/hero";
import type { ButtonProps } from "@/components/ui/button";

function AnimatedButton({
  children,
  loading,
  ...props
}: AnimatedButtonProps & ButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full sm:w-auto"
    >
      <Button
        disabled={loading}
        {...props}
        className={`w-full sm:w-auto ${props.className}`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="sr-only">Loading</span>
            Please wait
          </>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );
}

const benefits = [
  { text: "Early Access", icon: "✨" },
  { text: "Priority Support", icon: "🎯" },
  { text: "Founder Benefits", icon: "👑" },
] as const;

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [touched, setTouched] = useState(false);

  const emailId = useId();
  const isValidEmail = validateEmail(email);
  const showEmailError = touched && email && !isValidEmail;

  const handleJoinBeta = async () => {
    if (!isValidEmail) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await sendPostRequest<BetaResponse>({
        url: "/api/beta-access",
        data: { email },
      });

      setMessage({
        text:
          response.data.message ||
          "Welcome to our beta program! Check your email for next steps.",
        type: "success",
      });
      setEmail("");
      setTouched(false);
    } catch (error) {
      setMessage({
        text: "We couldn't process your request. Please try again in a few moments.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background"
      aria-labelledby="hero-heading"
    >
      <div className="container relative w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <motion.div
            {...fadeIn}
            className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-[90rem] mx-auto"
          >
            {/* Beta Badge */}
            <motion.div {...slideUp} className="mb-2 sm:mb-4">
              <Badge
                variant="secondary"
                className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                <Sparkles className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Limited Beta Access
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              id="hero-heading"
              {...slideUp}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.2] tracking-tight text-center px-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
            >
              Be Among the First to Experience Our{" "}
              <span className="text-primary whitespace-nowrap">
                Revolutionary Platform
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              {...slideUp}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-[85%] sm:max-w-[75%] lg:max-w-2xl text-center mx-auto px-4"
            >
              Join an exclusive group of early adopters shaping the future of
              learning.
            </motion.p>

            {/* Form Section */}
            <motion.div
              {...scaleIn}
              className="w-full max-w-[85%] sm:max-w-md mx-auto mt-4 sm:mt-6 space-y-4"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleJoinBeta();
                }}
                className="flex flex-col sm:flex-row gap-3 w-full"
              >
                <div className="flex-1">
                  <label htmlFor={emailId} className="sr-only">
                    Email address
                  </label>
                  <Input
                    id={emailId}
                    placeholder="Enter your email"
                    type="email"
                    className="h-10 sm:h-12 text-sm sm:text-base w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    aria-invalid={showEmailError || undefined}
                    aria-describedby={
                      showEmailError ? `${emailId}-error` : undefined
                    }
                  />
                </div>
                <AnimatedButton
                  type="submit"
                  size="lg"
                  className="h-10 sm:h-12 px-4 sm:px-8 whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
                  loading={loading}
                >
                  <span className="text-sm sm:text-base">Join the Beta</span>
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </AnimatedButton>
              </form>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Alert
                      variant={
                        message.type === "error" ? "destructive" : "default"
                      }
                    >
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Users Count */}
            <motion.div
              {...fadeIn}
              className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground bg-muted/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mt-4 sm:mt-6"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">
                Join 1,000+ early adopters already signed up
              </span>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              {...fadeIn}
              className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8 w-full max-w-[85%] sm:max-w-2xl mx-auto"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 bg-muted/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span
                    className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full`}
                    aria-hidden="true"
                  />
                  <span>{benefit.icon}</span>
                  {benefit.text}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
