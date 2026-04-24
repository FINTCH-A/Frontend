/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback }  from 'react';
import { motion }                  from 'framer-motion';
import {
  Plus, Search, Filter, MoreHorizontal,
  Pencil, Trash2, ShieldCheck, UserX,
  RefreshCw, Users,
} from 'lucide-react';

import { Button }       from '@/components/ui/button';
import { Input }        from '@/components/ui/input';
import { Badge }        from '@/components/ui/badge';
import { Skeleton }     from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UsuarioForm }        from './UsuarioForm';
import {
  useUsuarios,
  useCreateUsuario,
  useUpdateUsuario,
  useDeleteUsuario,
  useUpdateStatusUsuario,
} from '../hooks/use-usuarios';
import type { User, UserFilters } from '../types/usuarios.types';
import { getInitials, formatDate } from '@/lib/utils';

// ─── Badge helpers ────────────────────────────────────────────

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE:               { label: 'Activo',       className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  INACTIVE:             { label: 'Inactivo',     className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  SUSPENDED:            { label: 'Suspendido',   className: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' },
  PENDING_VERIFICATION: { label: 'Pendiente',    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' },
};

const roleConfig: Record<string, { label: string; className: string }> = {
  ADMIN:    { label: 'Admin',    className: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' },
  ANALYST:  { label: 'Analista', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' },
  CUSTOMER: { label: 'Cliente',  className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
};

// ─── Main component ───────────────────────────────────────────

export function MainUsuarios() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1, limit: 10,
  });
  const [search,        setSearch]        = useState('');
  const [dialogOpen,    setDialogOpen]    = useState(false);
  const [deleteOpen,    setDeleteOpen]    = useState(false);
  const [selectedUser,  setSelectedUser]  = useState<User | null>(null);
  const [deletingId,    setDeletingId]    = useState<number | null>(null);

  const { data, isLoading, refetch } = useUsuarios(filters);
  const createMutation  = useCreateUsuario();
  const updateMutation  = useUpdateUsuario();
  const deleteMutation  = useDeleteUsuario();
  const statusMutation  = useUpdateStatusUsuario();

  // ✅ Valor seguro para el total
  const totalUsuarios = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const currentPage = data?.meta?.page ?? 1;
  const currentLimit = data?.meta?.limit ?? 10;
  const hasNextPage = data?.meta?.hasNextPage ?? false;
  const hasPrevPage = data?.meta?.hasPrevPage ?? false;

  // ─── Handlers ──────────────────────────────────────────────

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setFilters((f) => ({ ...f, search: value || undefined, page: 1 }));
  }, []);

  const handleFilterChange = useCallback(
    (key: keyof UserFilters, value: string) => {
      setFilters((f) => ({
        ...f,
        [key]: value === 'all' ? undefined : value,
        page: 1,
      }));
    },
    [],
  );

  const openCreate = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const openDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleSubmit = (formData: any) => {
    if (selectedUser) {
      updateMutation.mutate(
        { id: selectedUser.id, data: formData },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteMutation.mutate(deletingId, {
      onSettled: () => {
        setDeleteOpen(false);
        setDeletingId(null);
      },
    });
  };

  const handleStatusToggle = (user: User) => {
    const newStatus =
      user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    statusMutation.mutate({ id: user.id, status: newStatus });
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalUsuarios} usuarios registrados
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="rounded-xl gap-2 font-semibold"
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, DNI..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 rounded-xl border-border/70"
              />
            </div>
            <Select
              onValueChange={(v) => handleFilterChange('role', v)}
            >
              <SelectTrigger className="w-full sm:w-40 rounded-xl">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="CUSTOMER">Cliente</SelectItem>
                <SelectItem value="ANALYST">Analista</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(v) => handleFilterChange('status', v)}
            >
              <SelectTrigger className="w-full sm:w-44 rounded-xl">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="INACTIVE">Inactivo</SelectItem>
                <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                <SelectItem value="PENDING_VERIFICATION">Pendiente</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="rounded-xl shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Usuario
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">
                    DNI
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">
                    Teléfono
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Rol
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden xl:table-cell">
                    Registro
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1.5">
                              <Skeleton className="h-3.5 w-32 rounded" />
                              <Skeleton className="h-3 w-44 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Skeleton className="h-3.5 w-20 rounded" />
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <Skeleton className="h-3.5 w-28 rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <Skeleton className="h-3.5 w-24 rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </td>
                      </tr>
                    ))
                  : !data?.data || data.data.length === 0
                  ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-muted rounded-2xl">
                              <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="font-semibold text-foreground">
                              No hay usuarios
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Crea el primer usuario con el botón de arriba
                            </p>
                            <Button
                              onClick={openCreate}
                              size="sm"
                              className="rounded-xl mt-1"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Nuevo Usuario
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  : data.data.map((user) => {
                    const status = statusConfig[user.status];
                    const role   = roleConfig[user.role];
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border/40 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell font-mono text-xs">
                          {user.dni}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                          {user.phone}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${role.className}`}>
                            {role.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden xl:table-cell">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuItem
                                onClick={() => openEdit(user)}
                                className="gap-2 cursor-pointer"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(user)}
                                className="gap-2 cursor-pointer"
                              >
                                {user.status === 'ACTIVE'
                                  ? <><UserX className="h-3.5 w-3.5" />Suspender</>
                                  : <><ShieldCheck className="h-3.5 w-3.5" />Activar</>}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDelete(user.id)}
                                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination - ✅ Ahora usa valores seguros */}
          {data && data.data && data.data.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                Mostrando {((currentPage - 1) * currentLimit) + 1}
                {' '}—{' '}
                {Math.min(currentPage * currentLimit, totalUsuarios)}
                {' '}de {totalUsuarios}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevPage}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))
                  }
                  className="rounded-xl text-xs h-8"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))
                  }
                  className="rounded-xl text-xs h-8"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Editar usuario' : 'Nuevo usuario'}
            </DialogTitle>
          </DialogHeader>
          <UsuarioForm
            user={selectedUser ?? undefined}
            onSubmit={handleSubmit}
            isPending={isPending}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* AlertDialog eliminar */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado
              permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
