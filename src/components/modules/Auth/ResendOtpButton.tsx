"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resendVerificationOtp } from "@/services/auth.services";

interface ResendOtpButtonProps {
  email: string;
  initialCooldownSeconds?: number;
}

export function ResendOtpButton({
  email,
  initialCooldownSeconds = 300,
}: ResendOtpButtonProps) {
  const [cooldown, setCooldown] = useState(initialCooldownSeconds);
  const [isCooldownActive, setIsCooldownActive] = useState(true);

  useEffect(() => {
    if (!isCooldownActive || cooldown <= 0) {
      if (cooldown <= 0) setIsCooldownActive(false);
      return;
    }
    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown, isCooldownActive]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => resendVerificationOtp({ email }),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("OTP resent successfully!");
        setCooldown(initialCooldownSeconds);
        setIsCooldownActive(true);
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to resend OTP");
    },
  });

  const handleResend = () => {
    if (isCooldownActive || isPending) return;
    mutate();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={handleResend}
      disabled={isCooldownActive || isPending}
      className="text-xs text-gray-500 hover:text-gray-800"
    >
      {isCooldownActive
        ? `Resend OTP in ${formatTime(cooldown)}`
        : isPending
          ? "Sending..."
          : "Resend OTP"}
    </Button>
  );
}
