"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Download, FileText, Loader2, Printer, X, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Advance } from "@/types/advance"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { batchMarkAdvancesAsRepaid } from "@/services/advance-service"
import { Row } from "@tanstack/react-table"

interface BulkUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAdvances: Row<Advance>[];
}

interface UpdateResult {
  updated: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    amountRepaid?: number
  }>
  failed: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    reason: string
  }>
}

type ProcessingStatus = "idle" | "processing" | "completed" | "error"

export function BulkUpdateDialog({ open, onOpenChange, selectedAdvances }: BulkUpdateDialogProps) {
  const [status, setStatus] = useState<ProcessingStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<UpdateResult | null>(null)
  const { toast } = useToast()

  const handleBulkUpdate = async () => {
    try {
      setStatus("processing")
      setProgress(0)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 300)

      const selectedIds = selectedAdvances.map((advance) => advance.original._id)
      const result = await batchMarkAdvancesAsRepaid(selectedIds)

      clearInterval(progressInterval)
      setProgress(100)
      setResults(result)
      setStatus("completed")

      toast({
        title: "Bulk update completed",
        description: `Successfully updated ${result.updated.length} advances. ${result.failed.length} failed.`,
        variant: result.failed.length > 0 ? "default" : "default",
      })
    } catch (error) {
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An error occurred while updating advances. Please try again.",
      })
    }
  }

  const resetDialog = () => {
    setStatus("idle")
    setProgress(0)
    setResults(null)
  }

  const handleClose = () => {
    resetDialog()
    onOpenChange(false)
  }

  const printResults = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return


    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Innova Limited - Advance Update Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { display: flex; align-items: center; margin-bottom: 30px; }
            .logo { height: 60px; margin-right: 20px; }
            .title { color: #333; }
            .summary { margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f0f0f0; }
            .success { color: #10b981; }
            .error { color: #ef4444; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/innova-logo1.png" alt="Innova Limited Logo" class="logo" />
            <h1 class="title">Innova Limited - Advance Update Results</h1>
          </div>
          
          <div class="summary">
            <h2>Summary</h2>
            <p>Total Processed: ${results?.updated.length! + results?.failed.length!}</p>
            <p>Successfully Updated: <span class="success">${results?.updated.length}</span></p>
            <p>Failed: <span class="error">${results?.failed.length}</span></p>
            <p>Date: ${new Date().toLocaleString()}</p>
          </div>
          
          ${
            results?.updated.length
              ? `
            <h2>Successfully Updated Advances</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  ${results.updated[0].amountRepaid !== undefined ? "<th>Amount Repaid</th>" : ""}
                </tr>
              </thead>
              <tbody>
                ${results.updated
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.id}</td>
                    <td>${item.firstName} ${item.lastName}</td>
                    <td>${item.email}</td>
                    ${item.amountRepaid !== undefined ? `<td>$${item.amountRepaid.toFixed(2)}</td>` : ""}
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : ""
          }
          
          ${
            results?.failed.length
              ? `
            <h2>Failed Updates</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                ${results.failed
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.id}</td>
                    <td>${item.firstName || "N/A"} ${item.lastName || "N/A"}</td>
                    <td>${item.email || "N/A"}</td>
                    <td class="error">${item.reason}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : ""
          }
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Innova Limited. All rights reserved.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  const downloadCSV = () => {
    if (!results) return

    const headers = ["ID", "First Name", "Last Name", "Email", "Status", "Details"]

    const updatedRows = results.updated.map((item) => [
      item.id,
      item.firstName,
      item.lastName,
      item.email,
      "Success",
      item.amountRepaid ? `Amount Repaid: ${item.amountRepaid}` : "",
    ])

    const failedRows = results.failed.map((item) => [
      item.id,
      item.firstName || "N/A",
      item.lastName || "N/A",
      item.email || "N/A",
      "Failed",
      item.reason,
    ])

    const allRows = [headers, ...updatedRows, ...failedRows]
    const csvContent = allRows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `advance-update-results-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadJSON = () => {
    if (!results) return

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `advance-update-results-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={status === "processing" ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px]">
        <div className="absolute right-4 top-4">
          {status !== "processing" && (
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>

        <DialogHeader>
          <div className="flex items-center gap-2">
            <img src="/innova-logo1.png" alt="Innova Limited" className="h-10" />
            <DialogTitle>Bulk Update Advances</DialogTitle>
          </div>
          {status === "idle" && (
            <DialogDescription>
              You are about to update the status of {selectedAdvances.length} selected advances.
            </DialogDescription>
          )}
        </DialogHeader>

        {status === "idle" && (
          <>
            <div className="space-y-4 py-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Important Information
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  This action will mark the selected advances as repaid. Only advances in &apos;repaying&apos; status can be
                  updated. This action cannot be undone.
                </p>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">Selected Advances</h4>
                <div className="rounded-md border p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedAdvances.slice(0, 5).map((advance) => (
                      <Badge key={advance.original._id} variant="outline">
                        {advance.original.employee.firstName} {advance.original.employee.lastName}
                      </Badge>
                    ))}
                    {selectedAdvances.length > 5 && (
                      <Badge variant="outline">+{selectedAdvances.length - 5} more</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleBulkUpdate}>Proceed with Update</Button>
            </DialogFooter>
          </>
        )}

        {status === "processing" && (
          <div className="space-y-6 py-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative h-20 w-20">
                <Loader2 className="h-20 w-20 animate-spin text-primary/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Processing Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we update the status of your selected advances.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Validating advances</span>
                <span>Updating status</span>
                <span>Finalizing</span>
              </div>
            </div>
          </div>
        )}

        {status === "completed" && results && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-medium">Update Completed</h3>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-500 flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Successfully Updated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{results.updated.length}</span>
                  <CardDescription>advances</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-500 flex items-center text-sm">
                    <XCircle className="h-4 w-4 mr-1" />
                    Failed Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{results.failed.length}</span>
                  <CardDescription>advances</CardDescription>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="updated" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="updated" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Updated ({results.updated.length})
                </TabsTrigger>
                <TabsTrigger value="failed" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Failed ({results.failed.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="updated">
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  {results.updated.length > 0 ? (
                    <div className="space-y-4">
                      {results.updated.map((item) => (
                        <div key={item.id} className="rounded-lg border p-3">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {item.firstName} {item.lastName}
                            </div>
                            {item.amountRepaid !== undefined && (
                              <div className="text-sm text-muted-foreground">
                                Amount: ${item.amountRepaid.toFixed(2)}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{item.email}</div>
                          <div className="text-xs text-muted-foreground truncate">ID: {item.id}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No successful updates
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="failed">
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  {results.failed.length > 0 ? (
                    <div className="space-y-4">
                      {results.failed.map((item) => (
                        <div key={item.id} className="rounded-lg border p-3">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {item.firstName || "N/A"} {item.lastName || "N/A"}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{item.email || "N/A"}</div>
                          <div className="mt-1 text-sm text-red-500">{item.reason}</div>
                          <div className="text-xs text-muted-foreground truncate">ID: {item.id}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No failed updates
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Export Results</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={printResults}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCSV}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={downloadJSON}>
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 py-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Update Failed</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error processing your request. Please try again.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleBulkUpdate}>Retry</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
