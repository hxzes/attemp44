"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bitcoin, Wallet } from "lucide-react"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("btc")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handleUpgrade = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onClose()

      // In a real app, this would update the user's subscription in the database
      // and redirect to a success page or show a success message
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-purple-900/30 bg-black/90 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Upgrade to Premium</DialogTitle>
          <DialogDescription>Unlock all premium features and get access to exclusive betting tips.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <Tabs defaultValue="pro" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                Basic
              </TabsTrigger>
              <TabsTrigger value="pro" className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white">
                Pro
              </TabsTrigger>
              <TabsTrigger
                value="elite"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                Elite
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-4">
              <div className="rounded-md bg-purple-900/20 p-4">
                <h3 className="text-lg font-medium text-white">Basic Membership</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get started with standard betting tips and features.
                </p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-white">$29</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Standard betting tips</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Basic statistics</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Standard calculator</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="pro" className="mt-4">
              <div className="rounded-md bg-purple-900/20 p-4">
                <h3 className="text-lg font-medium text-white">Pro Membership</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get unlimited access to premium features and betting tips.
                </p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-white">$49</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Expert betting tips</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Real-time notifications</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Advanced bankroll management</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">VIP betting calculator</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="elite" className="mt-4">
              <div className="rounded-md bg-purple-900/20 p-4">
                <h3 className="text-lg font-medium text-white">Elite Membership</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our most exclusive package with personalized service.
                </p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-white">$99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">All Pro features</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">1-on-1 betting consultation</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Early access to premium tips</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Exclusive VIP community</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-purple-600/50 text-center text-[10px] text-purple-100">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Priority customer support</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <h3 className="mb-2 text-sm font-medium text-white">Payment Method</h3>
            <Tabs defaultValue="btc" onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="btc"
                  className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
                >
                  <Bitcoin className="mr-2 h-4 w-4" />
                  Bitcoin
                </TabsTrigger>
                <TabsTrigger
                  value="sol"
                  className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Solana
                </TabsTrigger>
              </TabsList>

              <TabsContent value="btc" className="mt-4 space-y-4">
                <div className="rounded-md bg-black/60 p-4">
                  <div className="mb-4 text-center">
                    <div className="mx-auto h-32 w-32 rounded-md bg-white p-2">
                      {/* This would be a QR code in a real app */}
                      <div className="flex h-full w-full items-center justify-center bg-black text-xs text-white">
                        BTC QR Code
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="btc-address">Bitcoin Address</Label>
                    <div className="flex">
                      <Input
                        id="btc-address"
                        value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                        readOnly
                        className="rounded-r-none border-r-0"
                      />
                      <Button
                        variant="outline"
                        className="rounded-l-none border-purple-900/30 hover:bg-purple-900/20"
                        onClick={() => navigator.clipboard.writeText("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Send exactly 0.0021 BTC to this address to activate your premium membership.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sol" className="mt-4 space-y-4">
                <div className="rounded-md bg-black/60 p-4">
                  <div className="mb-4 text-center">
                    <div className="mx-auto h-32 w-32 rounded-md bg-white p-2">
                      {/* This would be a QR code in a real app */}
                      <div className="flex h-full w-full items-center justify-center bg-black text-xs text-white">
                        SOL QR Code
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sol-address">Solana Address</Label>
                    <div className="flex">
                      <Input
                        id="sol-address"
                        value="5KLmDBGKUYrkQKuKQzXgwpjGAVMjWK4XfFJADKuWZajZ"
                        readOnly
                        className="rounded-r-none border-r-0"
                      />
                      <Button
                        variant="outline"
                        className="rounded-l-none border-purple-900/30 hover:bg-purple-900/20"
                        onClick={() => navigator.clipboard.writeText("5KLmDBGKUYrkQKuKQzXgwpjGAVMjWK4XfFJADKuWZajZ")}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Send exactly 0.5 SOL to this address to activate your premium membership.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()} className="border-purple-900/30 hover:bg-purple-900/20">
            Cancel
          </Button>
          <Button onClick={handleUpgrade} className="bg-purple-600 hover:bg-purple-700" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "I've Sent Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

