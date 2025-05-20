import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Home, User, MapPin, CreditCard, Bell, Lock, Shield, Palette, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MainMenu = () => {
  const { setActiveScreen } = useApp();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fechar menu quando mudar de tela
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  // Menu items organizados por categoria
  const menuItems = [
    {
      category: "Menu Principal",
      items: [
        { 
          icon: <Home className="w-5 h-5" />, 
          label: "Página Inicial", 
          onClick: () => setActiveScreen('home')
        }
      ]
    },
    {
      category: "Dados Pessoais",
      items: [
        { 
          icon: <User className="w-5 h-5" />, 
          label: "Meu Perfil", 
          onClick: () => setActiveScreen('account') 
        },
        { 
          icon: <MapPin className="w-5 h-5" />, 
          label: "Endereço", 
          onClick: () => {} 
        },
        { 
          icon: <CreditCard className="w-5 h-5" />, 
          label: "Dados Bancários", 
          onClick: () => {} 
        }
      ]
    },
    {
      category: "Configurações",
      items: [
        { 
          icon: <Bell className="w-5 h-5" />, 
          label: "Notificações", 
          onClick: () => {} 
        },
        { 
          icon: <Lock className="w-5 h-5" />, 
          label: "Privacidade", 
          onClick: () => {} 
        },
        { 
          icon: <Shield className="w-5 h-5" />, 
          label: "Segurança", 
          onClick: () => {} 
        },
        { 
          icon: <Palette className="w-5 h-5" />, 
          label: "Tema", 
          onClick: () => {} 
        }
      ]
    }
  ];

  // Versão mobile: menu lateral com drawer
  if (isMobile) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Coletivo Bank</h2>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <SheetTitle className="text-lg">Coletivo Bank</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="overflow-y-auto h-full py-2">
                {menuItems.map((category, idx) => (
                  <div key={idx} className="px-2 py-3">
                    <h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">
                      {category.category}
                    </h3>
                    {category.items.map((item, itemIdx) => (
                      <SheetClose asChild key={itemIdx}>
                        <Button
                          variant="ghost"
                          onClick={item.onClick}
                          className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Button>
                      </SheetClose>
                    ))}
                    {idx < menuItems.length - 1 && (
                      <Separator className="my-2 mx-3" />
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    );
  }

  // Versão desktop: menu horizontal
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="flex items-center justify-between p-4 max-w-[1200px] mx-auto">
        <h2 className="text-lg font-semibold">Coletivo Bank</h2>
        <div className="flex space-x-6">
          {menuItems.map((category) => (
            <DropdownMenu key={category.category}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium">
                  {category.category}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {category.items.map((item, idx) => (
                  <DropdownMenuItem 
                    key={idx} 
                    onClick={item.onClick}
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MainMenu;