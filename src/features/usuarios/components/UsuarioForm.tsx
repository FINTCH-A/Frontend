
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, UserPlus, UserCog, Mail, Lock, Calendar, Phone, IdCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import type { User } from '../types/usuarios.types';

// ✅ Esquemas con mejor validación
const createSchema = z.object({
  firstName: z.string().min(1, 'Requerido').max(100),
  lastName: z.string().min(1, 'Requerido').max(100),
  dni: z.string().regex(/^\d{8}$/, 'DNI debe tener 8 dígitos'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'Teléfono inválido').max(20),
  dateOfBirth: z.string().min(1, 'Requerido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Debe tener mayúscula, minúscula y número'),
  role: z.enum(['ADMIN', 'ANALYST', 'CUSTOMER']).default('CUSTOMER').optional(),
});

const editSchema = z.object({
  firstName: z.string().min(1, 'Requerido').max(100),
  lastName: z.string().min(1, 'Requerido').max(100),
  phone: z.string().min(7, 'Teléfono inválido').max(20),
  dateOfBirth: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']),
});

type CreateForm = z.infer<typeof createSchema>;
type EditForm = z.infer<typeof editSchema>;

interface UsuarioFormProps {
  user?: User;
  onSubmit: (data: any) => void;
  isPending: boolean;
  onCancel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsuarioForm({
  user,
  onSubmit,
  isPending,
  onCancel,
  open,
  onOpenChange,
}: UsuarioFormProps) {
  const isEditing = !!user;

  // Usar formulario separado para creación y edición
  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      password: '',
      role: 'CUSTOMER',
    },
  });

  const editForm = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      status: 'ACTIVE',
    },
  });

  // Actualizar valores cuando se abre el modal de edición
  useEffect(() => {
    if (isEditing && user) {
      editForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth?.split('T')[0] || '',
        status: user.status,
      });
    }
  }, [isEditing, user, editForm]);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!open) {
      createForm.reset();
      editForm.reset();
    }
  }, [open, createForm, editForm]);

  const handleCreateSubmit = (data: CreateForm) => {
    onSubmit(data);
  };

  const handleEditSubmit = (data: EditForm) => {
    onSubmit(data);
  };

  const currentForm = isEditing ? editForm : createForm;
  const currentOnSubmit = isEditing ? handleEditSubmit : handleCreateSubmit;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl p-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-2xl rounded-3xl border-0 overflow-y-auto m-2 mr-4"
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <SheetHeader className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
              </SheetTitle>
              {isEditing && user && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  ID: #{user.id}
                </Badge>
              )}
            </div>
            <SheetDescription className="text-sm text-muted-foreground mt-2">
              {isEditing
                ? 'Actualiza la información del usuario'
                : 'Completa los datos para crear un nuevo usuario'}
            </SheetDescription>
          </SheetHeader>

          {/* Formulario */}
          <div className="mt-6">
            <Form {...(currentForm as any)}>
              <form onSubmit={currentForm.handleSubmit(currentOnSubmit as SubmitHandler<any>)} className="space-y-5">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Juan"
                            className="rounded-xl h-11 border-border/70"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Apellidos</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Pérez García"
                            className="rounded-xl h-11 border-border/70"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campos solo para creación */}
                {!isEditing && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                        name="dni"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <IdCard className="h-3 w-3" />
                              DNI
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="12345678"
                                maxLength={8}
                                className="rounded-xl h-11 border-border/70"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              Teléfono
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+51987654321"
                                className="rounded-xl h-11 border-border/70"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            Correo electrónico
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="juan@email.com"
                              className="rounded-xl h-11 border-border/70"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              Fecha de nacimiento
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="rounded-xl h-11 border-border/70"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Rol</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl h-11 border-border/70">
                                  <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="CUSTOMER">Cliente</SelectItem>
                                <SelectItem value="ANALYST">Analista</SelectItem>
                                <SelectItem value="ADMIN">Administrador</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <Lock className="h-3 w-3" />
                            Contraseña
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password123!"
                              className="rounded-xl h-11 border-border/70"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Campos solo para edición */}
                {isEditing && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              Teléfono
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+51987654321"
                                className="rounded-xl h-11 border-border/70"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              Fecha de nacimiento
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="rounded-xl h-11 border-border/70"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={isEditing ? (editForm.control as any) : (createForm.control as any)}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Estado</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-11 border-border/70">
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="ACTIVE">Activo</SelectItem>
                              <SelectItem value="INACTIVE">Inactivo</SelectItem>
                              <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                              <SelectItem value="PENDING_VERIFICATION">
                                Pendiente verificación
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isPending}
                    className="flex-1 rounded-xl h-11 font-semibold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-xl h-11 font-semibold bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        {isEditing ? <UserCog className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        {isEditing ? 'Guardar cambios' : 'Crear usuario'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
