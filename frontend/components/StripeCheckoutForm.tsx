"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { LuxuryButton } from "./DesignSystem";

export default function StripeCheckoutForm({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // Prevent automatic redirect if possible to handle UI state locally
    });

    if (error) {
      setMessage(error.message ?? "Ocurrió un error inesperado.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("¡Pago realizado con éxito!");
      onSuccess();
    } else {
      setMessage("Ocurrió un error inesperado.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      {message && (
        <div className="text-sm text-red-500 border border-red-500/20 bg-red-500/5 p-4 rounded-sm mt-4">
          {message}
        </div>
      )}
      <LuxuryButton
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full mt-4"
      >
        {isProcessing ? "Procesando..." : `Pagar $${amount.toLocaleString("es-MX")} MXN`}
      </LuxuryButton>
    </form>
  );
}
