"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Smartphone, Mail, Key } from "lucide-react"

interface MultiFactorAuthProps {
  onVerify: (code: string) => Promise<void>
  onResend: () => void
  method: "sms" | "email" | "app"
  isLoading?: boolean
  error?: string
}

export function MultiFactorAuth({ onVerify, onResend, method, isLoading = false, error }: MultiFactorAuthProps) {
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) return

    setIsVerifying(true)
    try {
      await onVerify(code)
    } finally {
      setIsVerifying(false)
    }
  }

  const getMethodIcon = () => {
    switch (method) {
      case "sms":
        return <Smartphone className="w-5 h-5" />
      case "email":
        return <Mail className="w-5 h-5" />
      case "app":
        return <Key className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const getMethodText = () => {
    switch (method) {
      case "sms":
        return "SMS to your registered phone number"
      case "email":
        return "email to your registered address"
      case "app":
        return "authenticator app"
      default:
        return "your registered method"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <img src="/images/ncas-logo.png" alt="NCAS" className="w-16 h-16 object-contain" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>Enter the 6-digit verification code sent via {getMethodText()}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <div className="relative">
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setCode(value)
                }}
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{getMethodIcon()}</div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              For demo purposes, enter any 6-digit code (e.g., 123456)
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" disabled={code.length !== 6 || isVerifying || isLoading}>
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <Button type="button" variant="link" onClick={onResend} className="text-sm">
                Didn't receive the code? Resend
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Security Notice</span>
            </div>
            <p className="text-blue-600 text-xs mt-1">
              This additional security step helps protect your account from unauthorized access.
            </p>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
