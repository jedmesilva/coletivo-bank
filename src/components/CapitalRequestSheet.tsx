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
      <SheetContent 
        side="bottom" 
        className="h-[100dvh] max-h-[100dvh] p-0 safe-area-pb"
        aria-describedby="capital-request-description"
      >
        <div id="capital-request-description" className="sr-only">
          Modal para solicitar capital de fundos coletivos
        </div>
        <div className="flex flex-col h-full">
          <div className="p-4 flex-1 overflow-y-auto">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="text-2xl">Solicitar Capital</SheetTitle>
              <SheetDescription>
                Solicite um empréstimo do fundo coletivo. Administradores precisarão aprovar a solicitação.
              </SheetDescription>
            </SheetHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg mb-2">Selecione um fundo</h3>
                  <p className="text-sm text-gray-500 mb-4">Escolha um fundo para solicitar capital:</p>
                  <div className="grid grid-cols-1 gap-3">
                    {funds.map((fund) => (
                      <button
                        key={fund.id}
                        type="button"
                        className="flex items-center p-4 border border-gray-200 rounded-xl 
                                  hover:border-primary/30 hover:bg-primary/5 transition-all"
                        onClick={() => handleFundSelect(fund.id)}
                      >
                        <div className="relative mr-3">
                          <img 
                            src={fund.image} 
                            alt={fund.name}
                            className="w-14 h-14 rounded-lg object-cover shadow-sm ring-1 ring-gray-200" 
                          />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-gray-900">{fund.name}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{fund.description}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">Membros: {fund.members.length}</p>
                            <p className="text-sm font-semibold text-primary">
                              {formatCurrency(fund.balance)}
                            </p>
                          </div>
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
                    <div className="flex items-center p-5 border border-primary/20 rounded-xl bg-primary/5 shadow-sm">
                      <div className="relative mr-4">
                        <img 
                          src={selectedFund.image} 
                          alt={selectedFund.name}
                          className="w-16 h-16 rounded-lg object-cover shadow-sm ring-1 ring-primary/20" 
                        />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Fundo selecionado</p>
                        <p className="font-bold text-lg text-gray-900">{selectedFund.name}</p>
                        <div className="flex items-center mt-1">
                          <p className="text-sm font-medium text-primary">
                            Saldo disponível: {formatCurrency(selectedFund.balance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Amount field */}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Valor solicitado 
                          <span className="text-xs text-gray-500 ml-1.5">(obrigatório)</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-gray-600 font-medium">R$</span>
                            </div>
                            <Input 
                              placeholder="0,00" 
                              {...field} 
                              className="pl-10 text-lg font-semibold" 
                              inputMode="numeric" 
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">Insira o valor que deseja solicitar do fundo</p>
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
                        <FormLabel className="flex items-center">
                          Descrição da solicitação
                          <span className="text-xs text-gray-500 ml-1.5">(obrigatório)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o motivo da solicitação de capital..." 
                            {...field} 
                            className="resize-none min-h-[100px]"
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">Explique detalhadamente o propósito e como o recurso será utilizado</p>
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
                        <FormLabel className="flex items-center">
                          Prazo de pagamento
                          <span className="text-xs text-gray-500 ml-1.5">(obrigatório)</span>
                        </FormLabel>
                        <p className="text-xs text-gray-500 mb-3">Selecione quando pretende pagar esta solicitação de capital</p>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleRepaymentOptionChange(value);
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-3"
                          >
                            <FormItem className="space-y-0 m-0">
                              <FormControl>
                                <label className={`flex flex-col items-center justify-center h-16 border rounded-lg 
                                                 transition-all cursor-pointer px-3 py-4
                                                 ${field.value === 'week' ? 
                                                 'border-primary bg-primary/5 shadow-sm' : 
                                                 'border-gray-200 hover:border-gray-300'}`}>
                                  <RadioGroupItem value="week" className="sr-only" />
                                  <span className="font-semibold">1 semana</span>
                                  <span className="text-xs text-gray-500">Curto prazo</span>
                                </label>
                              </FormControl>
                            </FormItem>
                            <FormItem className="space-y-0 m-0">
                              <FormControl>
                                <label className={`flex flex-col items-center justify-center h-16 border rounded-lg 
                                                 transition-all cursor-pointer px-3 py-4
                                                 ${field.value === '30days' ? 
                                                 'border-primary bg-primary/5 shadow-sm' : 
                                                 'border-gray-200 hover:border-gray-300'}`}>
                                  <RadioGroupItem value="30days" className="sr-only" />
                                  <span className="font-semibold">30 dias</span>
                                  <span className="text-xs text-gray-500">1 mês</span>
                                </label>
                              </FormControl>
                            </FormItem>
                            <FormItem className="space-y-0 m-0">
                              <FormControl>
                                <label className={`flex flex-col items-center justify-center h-16 border rounded-lg 
                                                 transition-all cursor-pointer px-3 py-4
                                                 ${field.value === '60days' ? 
                                                 'border-primary bg-primary/5 shadow-sm' : 
                                                 'border-gray-200 hover:border-gray-300'}`}>
                                  <RadioGroupItem value="60days" className="sr-only" />
                                  <span className="font-semibold">60 dias</span>
                                  <span className="text-xs text-gray-500">2 meses</span>
                                </label>
                              </FormControl>
                            </FormItem>
                            <FormItem className="space-y-0 m-0">
                              <FormControl>
                                <label className={`flex flex-col items-center justify-center h-16 border rounded-lg 
                                                 transition-all cursor-pointer px-3 py-4
                                                 ${field.value === '90days' ? 
                                                 'border-primary bg-primary/5 shadow-sm' : 
                                                 'border-gray-200 hover:border-gray-300'}`}>
                                  <RadioGroupItem value="90days" className="sr-only" />
                                  <span className="font-semibold">90 dias</span>
                                  <span className="text-xs text-gray-500">3 meses</span>
                                </label>
                              </FormControl>
                            </FormItem>
                            <FormItem className="space-y-0 m-0 col-span-2">
                              <FormControl>
                                <label className={`flex items-center justify-center h-12 border rounded-lg 
                                                 transition-all cursor-pointer px-3 py-3
                                                 ${field.value === 'custom' ? 
                                                 'border-primary bg-primary/5 shadow-sm' : 
                                                 'border-gray-200 hover:border-gray-300'}`}>
                                  <RadioGroupItem value="custom" className="sr-only" />
                                  <span className="font-semibold">Data personalizada</span>
                                </label>
                              </FormControl>
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
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-blue-800">
                    <div className="flex items-start">
                      <div className="mr-3 text-blue-600 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 16v-4"></path>
                          <path d="M12 8h.01"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-blue-900">Informações de pagamento</h4>
                        <p className="text-sm leading-relaxed">
                          Este fundo cobra uma taxa de <span className="font-semibold">{interestRate}%</span> de juros 
                          sobre o valor solicitado. O valor total a ser devolvido será o solicitado 
                          mais a taxa de juros.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </form>
          </Form>
          </div>
          
          {/* Form actions */}
          {step === 2 && (
            <div className="sticky bottom-0 bg-white border-t p-4 w-full">
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  className="h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Enviar solicitação
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-12 rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CapitalRequestSheet;
