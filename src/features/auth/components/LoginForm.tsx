/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Loader2,
  LogIn, AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLogin } from '../hooks/use-auth';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    // Limpiar error anterior
    setErrorMessage(null);

    try {
      await loginMutation.mutateAsync(data);
      // Si tiene éxito, no hacer nada aquí porque el hook maneja la redirección
    } catch (error: any) {
      // Capturar el error y mostrar el mensaje
      console.log('Error capturado:', error);

      let message = 'Error al iniciar sesión';

      if (error?.response?.data?.message) {
        message = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }

      setErrorMessage(message);
      // Limpiar campo de contraseña por seguridad
      setValue('password', '');
    }
  };

  const isPending = loginMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <Card className="border border-border/50 shadow-xl rounded-2xl backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-6">
          {/* Logo */}
          <div className="flex items-center justify-center py-0">
            <Image
              src="/logo.png"
              alt="Avante Microfinanzas"
              width={200}
              height={70}
              className="object-contain block dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="Avante Microfinanzas"
              width={200}
              height={70}
              className="object-contain hidden dark:block brightness-0 invert"
              priority
            />
          </div>

          <div className="text-center space-y-0.5">
            <CardTitle className="text-xl font-bold">
              Iniciar sesión
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Mostrar error de autenticación */}
          {errorMessage && (
            <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                className="h-11 rounded-xl border-border/70 focus:border-primary"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-xl border-border/70 focus:border-primary pr-11"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-xl font-semibold text-sm mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Ingresar
                </>
              )}
            </Button>
          </form>

          {/* Enlace a registro */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Créate una cuenta gratis
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="p-4 bg-muted/60 rounded-xl border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Credenciales de prueba
            </p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span>admin@avante.pe</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Analista:</span>
                <span>analista@avante.pe</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cliente:</span>
                <span>juan.perez@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contraseña:</span>
                <span>Password123!</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
