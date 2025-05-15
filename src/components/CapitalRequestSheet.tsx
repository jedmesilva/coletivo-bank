import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/lib/utils';

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

// Schema for the form validation
const formSchema = z.object({
  fundId: z.string({ required_error: "Selecione um fundo" }),
  amount: z.string().min(1, "Valor é obrigatório")
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Valor precisa ser maior que zero",
    }),
  description: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  repaymentOption: z.enum(['custom', 'week', '30days', '60days', '90days']),
  repaymentDate: z.date({ required_error: "Data de pagamento é obrigatória" }),
});

type FormValues = z.infer<typeof formSchema>;

const CapitalRequestSheet = () => {
  const { 
    isCapitalRequestOpen, 
    setIsCapitalRequestOpen, 
    selectedFundIdForCapitalRequest, 
    setSelectedFundIdForCapitalRequest,
    funds,
    requestCapitalFromFund,
  } = useApp();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  // Get the selected fund's interest rate (mock value for now)
  const selectedFund = funds.find(f => f.id === selectedFundIdForCapitalRequest);
  const interestRate = 5; // Mock value, typically this would come from the fund's settings

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fundId: selectedFundIdForCapitalRequest || '',
      amount: '',
      description: '',
      repaymentOption: '30days',
      repaymentDate: addDays(new Date(), 30),
    }
  });

  // Update form when selectedFundIdForCapitalRequest changes
  React.useEffect(() => {
    if (selectedFundIdForCapitalRequest) {
      form.setValue('fundId', selectedFundIdForCapitalRequest);
      setStep(selectedFundIdForCapitalRequest ? 2 : 1);
    }
  }, [selectedFundIdForCapitalRequest, form]);

  // Update date when repayment option changes
  const handleRepaymentOptionChange = (value: string) => {
    const today = new Date();
    let newDate = today;

    switch (value) {
      case 'week':
        newDate = addDays(today, 7);
        break;
      case '30days':
        newDate = addDays(today, 30);
        break;
      case '60days':
        newDate = addDays(today, 60);
        break;
      case '90days':
        newDate = addDays(today, 90);
        break;
      case 'custom':
        // Keep current selected date
        newDate = form.getValues('repaymentDate');
        break;
    }

    form.setValue('repaymentDate', newDate);
  };

  const handleCancel = () => {
    setIsCapitalRequestOpen(false);
    setSelectedFundIdForCapitalRequest(null);
    setStep(1);
    form.reset();
  };

  const handleFundSelect = (fundId: string) => {
    setSelectedFundIdForCapitalRequest(fundId);
    form.setValue('fundId', fundId);
    setStep(2);
  };

  const onSubmit = (data: FormValues) => {
    const amountNumber = Number(data.amount.replace(/[^\d.-]/g, ''));
    
    requestCapitalFromFund(
      data.fundId,
      amountNumber,
      data.description,
      data.repaymentDate
    );
    
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de capital foi enviada para aprovação."
    });
    
    handleCancel();
  };

  return (
    <Sheet open={isCapitalRequestOpen} onOpenChange={setIsCapitalRequestOpen}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">Solicitar Capital</SheetTitle>
            <SheetDescription>
              Solicite um empréstimo do fundo coletivo. Administradores precisarão aprovar a solicitação.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Selecione um fundo</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {funds.map((fund) => (
                      <button
                        key={fund.id}
                        type="button"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => handleFundSelect(fund.id)}
                      >
                        <img 
                          src={fund.image} 
                          alt={fund.name}
                          className="w-12 h-12 rounded-md object-cover mr-3" 
                        />
                        <div className="text-left">
                          <p className="font-medium">{fund.name}</p>
                          <p className="text-sm text-gray-500">Saldo: {formatCurrency(fund.balance)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Fund display for step 2 */}
                  {selectedFund && (
                    <div className="flex items-center p-4 border rounded-lg bg-gray-50">
                      <img 
                        src={selectedFund.image} 
                        alt={selectedFund.name}
                        className="w-12 h-12 rounded-md object-cover mr-3" 
                      />
                      <div>
                        <p className="font-medium">{selectedFund.name}</p>
                        <p className="text-sm text-gray-500">Saldo: {formatCurrency(selectedFund.balance)}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Amount field */}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor solicitado</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-gray-500">R$</span>
                            </div>
                            <Input 
                              placeholder="0,00" 
                              {...field} 
                              className="pl-10" 
                              inputMode="numeric" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição da solicitação</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o motivo da solicitação de capital..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Repayment options */}
                  <FormField
                    control={form.control}
                    name="repaymentOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo de pagamento</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleRepaymentOptionChange(value);
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="week" />
                              </FormControl>
                              <FormLabel className="font-normal">1 semana</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="30days" />
                              </FormControl>
                              <FormLabel className="font-normal">30 dias</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="60days" />
                              </FormControl>
                              <FormLabel className="font-normal">60 dias</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="90days" />
                              </FormControl>
                              <FormLabel className="font-normal">90 dias</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0 col-span-2">
                              <FormControl>
                                <RadioGroupItem value="custom" />
                              </FormControl>
                              <FormLabel className="font-normal">Data personalizada</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Custom date picker - only shown when custom date option is selected */}
                  {form.watch('repaymentOption') === 'custom' && (
                    <FormField
                      control={form.control}
                      name="repaymentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de pagamento</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Interest rate info */}
                  <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                    <h4 className="font-medium mb-1">Taxa de juros</h4>
                    <p className="text-sm">Este fundo cobra {interestRate}% de juros sobre o valor solicitado.</p>
                  </div>

                  {/* Form actions */}
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                    >
                      Enviar solicitação
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CapitalRequestSheet;
