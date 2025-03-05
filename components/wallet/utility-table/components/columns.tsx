import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowDownIcon, ArrowUpIcon, BanknoteIcon, CreditCardIcon, WalletIcon, UserIcon, ScaleIcon, CircleDollarSignIcon } from "lucide-react";
import { UtilityTransaction } from "@/types/utility";
import { Separator } from "@/components/ui/separator";


const customIncludesStringFilter = (
  row: any,
  columnId: string,
  filterValue: string
) => {
  const searchValue = String(row.getValue(columnId) || "").toLowerCase();
  return searchValue.includes(filterValue.toLowerCase());
};

export const columns: ColumnDef<UtilityTransaction>[] = [
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) =>
      `${row.transactionId || ""} ${row.employee?.email || ""} ${row?.employee?.nationalId || ""} ${row.recipientDetails?.name || ""} ${row.recipientDetails?.phoneNumber || ""}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,
    enableSorting: false,
    size: 0,
    cell: () => null,
  },
  {
    accessorKey: "transactionId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction ID" />
    ),
    cell: ({ row }) => {
      const mpesaReceipt = row.original.mpesaReceiptNumber;
      const id = mpesaReceipt || row.getValue("transactionId");
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2 max-w-[180px]">
              <div className="font-medium truncate" title={id}>
                {id}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{id}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const getTypeConfig = (type: string) => {
        switch (type.toLowerCase()) {
          case 'recharge':
            return {
              icon: <BanknoteIcon className="h-4 w-4 mr-1" />,
              label: 'Recharge',
              class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
            };
          case 'b2c':
            return {
              icon: <WalletIcon className="h-4 w-4 mr-1" />,
              label: 'Withdrawal',
              class: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
            };
          case 'withdrawal':
            return {
              icon: <CreditCardIcon className="h-4 w-4 mr-1" />,
              label: 'Deduction',
              class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            };
          default:
            return {
              icon: <CreditCardIcon className="h-4 w-4 mr-1" />,
              label: type,
              class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            };
        }
      };

      const config = getTypeConfig(type);
      
      return (
        <Badge 
          variant="outline" 
          className={`capitalize flex items-center ${config.class}`}
        >
          {config.icon}
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const type = row.getValue("type") as string;
      
      return (
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${type.toLowerCase() === 'recharge' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {new Intl.NumberFormat("en-KE", {
              style: "currency",
              currency: "KES",
            }).format(amount)}
          </span>
          <span>
            {type.toLowerCase() === 'recharge' ? (
              <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-amber-500" />
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "recipientDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recipient" />
    ),
    cell: ({ row }) => {
      const details = row.original.recipientDetails;
      const employee = row.original.employee;
	  

      const name = details?.name || 'N/A';
	  const email = employee?.email || 'N/A';
      const id = employee?.nationalId || 'N/A';
      const phone = details?.phoneNumber || 'N/A';
      const amount = row.getValue("amount") as number;
      const balanceBefore = row.original.balanceBeforeTransaction;
      const balanceAfter = row.original.balanceAfterTransaction || 0;
      const type = row.getValue("type") as string;
      const status = row.getValue("status") as string;
      
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {name !== "N/A" 
                    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                    : <UserIcon className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium line-clamp-1" title={name}>
                  {name}
                </span>
                <span className="text-xs text-muted-foreground" title={phone}>
                  {phone}
                </span>
				
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-800 text-lg">
                  {name !== "N/A" 
                    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                    : <UserIcon className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-semibold">{name}</h4>
                <p className="text-sm text-muted-foreground">
                  {phone}
                </p>
				<p className="text-xs text-muted-foreground" title={email}>
				  {email}
				</p>
				<p className="text-xs text-muted-foreground" title={id}>
				  {id}
                </p>
                <div className="flex items-center pt-2">
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${
                      status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {status}
                  </Badge>
                </div>
              </div>
            </div>
            <Separator className="my-3" />
			<div className="space-y-2">
              <h4 className="text-sm font-semibold">Employee Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Phone Number:</div>
                <div className={`font-medium`}>
				{phone?phone:"N/A"}
                </div>
                <div className="text-muted-foreground">Email:</div>
                <div className="font-medium">
                  {email?email
                    : 'N/A'}
                </div>
                <div className="text-muted-foreground">National ID:</div>
                <div className="font-medium">
                  {id?id
                    : 'N/A'}
                </div>
              
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Transaction Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Amount:</div>
                <div className={`font-medium ${type.toLowerCase() === 'recharge' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KES",
                  }).format(amount)}
                </div>
                <div className="text-muted-foreground">Balance Before:</div>
                <div className="font-medium">
                  {balanceBefore 
                    ? new Intl.NumberFormat("en-KE", {
                        style: "currency",
                        currency: "KES",
                      }).format(type.toLowerCase() === 'recharge' ? balanceAfter-amount : balanceBefore)
                    : 'N/A'}
                </div>
                <div className="text-muted-foreground">Balance After:</div>
                <div className="font-medium">
                  {balanceAfter !== undefined
                    ? new Intl.NumberFormat("en-KE", {
                        style: "currency",
                        currency: "KES",
                      }).format(balanceAfter)
                    : 'N/A'}
                </div>
                <div className="text-muted-foreground">Transaction Type:</div>
                <div>
                  <Badge 
                    variant="outline" 
                    className={`capitalize flex items-center ${
                      type.toLowerCase() === 'recharge'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {type.toLowerCase() === 'recharge' ? (
                      <BanknoteIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <WalletIcon className="h-3 w-3 mr-1" />
                    )}
                    {type}
                  </Badge>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "balanceBeforeTransaction",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance Before" />
    ),
    cell: ({ row }) => {
      const balanceBefore = row.getValue("balanceBeforeTransaction") as number;
	  const balanceAfter = row.getValue("balanceAfterTransaction") as number;
	  const amount = row.getValue("amount") as number;
	  const type = row.getValue("type") as string;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <ScaleIcon className="h-4 w-4 text-slate-500" />
              <span className="font-medium text-slate-600">
                {balanceBefore
                  ? new Intl.NumberFormat("en-KE", {
                      style: "currency",
                      currency: "KES",
                    }).format(type.toLowerCase() === 'recharge' ? balanceAfter-amount : balanceBefore)
                  : "N/A"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Balance before transaction</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "balanceAfterTransaction",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance After" />
    ),
    cell: ({ row }) => {
      const balanceAfter = row.getValue("balanceAfterTransaction") as number;
      const balanceBefore = row.getValue("balanceBeforeTransaction") as number;
      const type = row.getValue("type") as string;
      const isIncrease = type.toLowerCase() === 'recharge';
      
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <CircleDollarSignIcon className="h-4 w-4 text-slate-500" />
              <span className={`font-medium ${
                balanceAfter !== undefined && balanceBefore
                  ? isIncrease
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                  : 'text-slate-600'
              }`}>
                {balanceAfter !== undefined
                  ? new Intl.NumberFormat("en-KE", {
                      style: "currency",
                      currency: "KES",
                    }).format(balanceAfter)
                  : "N/A"}
              </span>
              {balanceAfter !== undefined && balanceBefore && (
                <Badge 
                  variant="outline" 
                  className={`ml-2 ${
                    isIncrease
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isIncrease ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(balanceAfter - balanceBefore).toLocaleString()} KES
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p>Balance after transaction</p>
              {balanceAfter !== undefined && balanceBefore && (
                <p className="text-xs text-muted-foreground">
                  {isIncrease ? 'Increased' : 'Decreased'} by {Math.abs(balanceAfter - balanceBefore).toLocaleString()} KES
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || 'pending';
      const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
          case 'completed':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
          case 'pending':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
          case 'failed':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
      };

      return (
        <Badge 
          variant="outline" 
          className={`capitalize ${getStatusConfig(status)}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue("transactionDate") as string;
      if (!dateStr) return <div className="text-muted">N/A</div>;
      
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {format(date, "MMM dd, yyyy")}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(date, "HH:mm:ss")}
            </span>
          </div>
        );
      } catch {
        return <div className="text-muted">Invalid Date</div>;
      }
    },
  },
];