"use client";
import FeaturesSection from "@/components/feature-section";
import CTASection from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, ArrowRight, Users, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendPostRequest } from "@/utils/api";
import { validateEmail } from "@/lib/validate";
import { fadeIn, slideUp, scaleIn } from "@/lib/animation";
import type { BetaResponse, AnimatedButtonProps } from "@/types/hero";
import type { ButtonProps } from "@/components/ui/button";
import { Badge /*Navbar */ } from "@repo/ui/main";

const benefits = [
  { text: "Early Access", icon: "✨" },
  { text: "Priority Support", icon: "🎯" },
  { text: "Founder Benefits", icon: "👑" },
] as const;

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

export default function Home() {
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
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/beta-access`,
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
    <main className="relative w-screen min-h-[100svh] flex flex-col items-cente bg-gradient-to-b from-primary/10 via-primary/5 to-background">
      <Navbar />
      <section
        className="relative min-h-[90svh] sm:min-h-[85svh] lg:min-h-[80svh] flex items-center overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background"
        aria-labelledby="hero-heading"
      >
        <div className="container relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
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
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] sm:leading-[1.2] tracking-tight text-center px-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] mx-auto"
              >
                Be Among the First to Experience Our{" "}
                <span className="text-primary whitespace-nowrap">
                  Revolutionary Platform
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                {...slideUp}
                className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-[95%] sm:max-w-[85%] lg:max-w-3xl text-center mx-auto px-4"
              >
                Join an exclusive group of early adopters shaping the future of
                learning.
              </motion.p>

              {/* Form Section */}
              <motion.div
                {...scaleIn}
                className="w-full max-w-[95%] sm:max-w-lg lg:max-w-xl mx-auto mt-6 sm:mt-8 lg:mt-10 space-y-4"
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
                      className="h-12 sm:h-14 text-base sm:text-lg w-full"
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
                    className="h-12 sm:h-14 px-6 sm:px-8 whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="flex items-center gap-2 sm:gap-3 text-muted-foreground bg-muted/50 px-4 sm:px-5 py-2 sm:py-3 rounded-full mt-6 sm:mt-8 lg:mt-10"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Join 1,000+ early adopters already signed up
                </span>
              </motion.div>

              {/* Benefits Grid */}
              <motion.div
                {...fadeIn}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-10 lg:mt-12 w-full max-w-[95%] sm:max-w-2xl lg:max-w-3xl mx-auto"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-center gap-2 sm:gap-3 bg-muted/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
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
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
