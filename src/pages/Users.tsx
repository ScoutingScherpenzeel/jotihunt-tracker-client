import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { User } from '../types/User';
import { Navigate, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { SearchIcon, PencilIcon, Trash2Icon, ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useState } from 'react';
import { useAdmin } from '../hooks/admin.hook';
import { Skeleton } from '../components/ui/skeleton';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { toast } from '../components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';

export default function Users() {
  const navigate = useNavigate();
  const user = useAuthUser<User>();
  const { users, isLoading, updateUser, createUser, deleteUser } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);

  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  const filteredUsers = users?.filter((user: User) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  function handleDelete(user: User) {
    setSelectedUser(user);
    setIsConfirmDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!selectedUser) return;
    const result = await deleteUser(selectedUser._id);
    setIsConfirmDeleteDialogOpen(false);
    if (!result) {
      toast({ title: 'Er is een fout opgetreden', description: 'De gebruiker kon niet worden verwijderd.', variant: 'destructive' });
    } else {
      toast({ title: 'Gebruiker verwijderd', description: 'De gebruiker is succesvol verwijderd.' });
    }
  }

  function handleEdit(user: User) {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }

  function handleCreate() {
    setSelectedUser({ name: '', email: '', admin: false } as User);
    setIsDialogOpen(true);
  }

  async function handleSave() {
    if (!selectedUser) return;
    let result: boolean;
    if (selectedUser?._id) {
      result = await updateUser(selectedUser);
    } else {
      result = await createUser(selectedUser);
    }
    setIsDialogOpen(false);
    if (!result) {
      toast({ title: 'Er is een fout opgetreden', description: 'De gebruiker kon niet worden opgeslagen.', variant: 'destructive' });
    } else {
      toast({ title: 'Gebruiker opgeslagen', description: 'De gebruiker is succesvol opgeslagen.' });
    }
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(usersPerPage)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[300px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[50px]" />
          </TableCell>
          <TableCell>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  if (!user?.admin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="absolute z-10 top-0 left-0 w-full md:w-2/5 md:min-w-[700px] h-screen overflow-y-auto">
      <div className="flex flex-col p-2 gap-2">
        <Card className="sticky top-2 z-10">
          <CardContent>
            <div className="flex items-center mb-6 gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate('/')} aria-label="Go back to home">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Gebruikers</h1>
            </div>
            <div className="flex justify-between items-center mb-4 gap-3">
              <div className="relative flex items-center">
                <SearchIcon className="absolute ml-2 h-4 w-4 text-gray-500" />
                <Input type="text" placeholder="Zoek gebruikers..." value={searchTerm} onChange={handleSearch} className="pl-8" />
              </div>
              <Button onClick={handleCreate}>Nieuwe gebruiker</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Naam</TableHead>
                  <TableHead className="w-[45%]">E-mailadres</TableHead>
                  <TableHead className="w-[10%]">Admin</TableHead>
                  <TableHead className="w-[10%]">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  filteredUsers.slice(indexOfFirstUser, indexOfLastUser).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.admin ? 'Ja' : 'Nee'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(user)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(user)}>
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              {isLoading ? (
                <Skeleton className="h-4 w-[200px]" />
              ) : (
                <div>
                  {indexOfFirstUser + 1} tot {Math.min(indexOfLastUser, filteredUsers.length)} van {filteredUsers.length} gebruikers
                </div>
              )}
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastUser >= filteredUsers.length}>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Confirm delete dialog */}
            <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Weet je zeker dat je deze gebruiker wilt verwijderen?</AlertDialogTitle>
                  <AlertDialogDescription>Deze actie kan niet ongedaan worden gemaakt.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleDeleteConfirm}>
                    Verwijderen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Delete user dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedUser?._id ? 'Bewerk gebruiker' : 'Nieuwe gebruiker'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Naam
                    </Label>
                    <Input
                      id="name"
                      required
                      value={selectedUser?.name || ''}
                      className="col-span-3"
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value } as User)}
                      autoComplete="off"
                      data-1p-ignore
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      E-mailadres
                    </Label>
                    <Input
                      id="email"
                      required
                      type="email"
                      value={selectedUser?.email || ''}
                      className="col-span-3"
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value } as User)}
                      autoComplete="off"
                      data-1p-ignore
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Wachtwoord
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={selectedUser?.password || ''}
                      className="col-span-3"
                      onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value } as User)}
                      placeholder={selectedUser?._id && 'Laat leeg om niet te wijzigen'}
                      autoComplete="off"
                      data-1p-ignore
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="admin" className="text-right">
                      Admin
                    </Label>
                    <Switch
                      id="admin"
                      checked={selectedUser?.admin || false}
                      onCheckedChange={(e) => setSelectedUser({ ...selectedUser, admin: e } as User)}
                      disabled={selectedUser?._id == user._id}
                    />
                  </div>
                </div>
                <Button onClick={handleSave}>Opslaan</Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
