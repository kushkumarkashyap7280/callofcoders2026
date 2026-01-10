import { Button } from '@/components/ui/button';
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function CustomButton({ 
  onClick, 
  children, 
  variant = 'default',
  size = 'default',
  ...props 
}: CustomButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
}
