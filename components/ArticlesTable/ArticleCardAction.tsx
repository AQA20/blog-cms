import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, Edit } from 'lucide-react';
import { useArticleActions } from '@/hooks/useArticleActions';
import { AppAlertDialog } from '../AlertDialog/AlertDialog';
import { useRouter } from 'next/navigation';

export const ArticleCardAction = ({ itemId }: { itemId: number }) => {
  const {
    status,
    dialog,
    setDialog,
    handleActionStatusChange,
    handleArticleRemove,
    handleActionRestore,
  } = useArticleActions(itemId);

  const router = useRouter();

  const renderStatusButtons = () => {
    switch (status) {
      case 'Pending':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionStatusChange('Approved')}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionStatusChange('Rejected')}
            >
              Reject
            </Button>
          </>
        );
      case 'Approved':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionStatusChange('Rejected')}
            >
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionStatusChange('Pending')}
            >
              Move to Pending
            </Button>
          </>
        );
      case 'Rejected':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionStatusChange('Approved')}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionStatusChange('Pending')}
            >
              Move to Pending
            </Button>
          </>
        );
      case 'Trashed':
        return (
          <Button variant="outline" size="sm" onClick={handleActionRestore}>
            Restore
          </Button>
        );
    }
  };

  return (
    <>
      {renderStatusButtons()}
      {status !== 'Trashed' && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/article/edit/${itemId}`)}
          >
            <Edit />
          </Button>
          <Button variant="outline" size="sm" onClick={handleArticleRemove}>
            <Trash />
          </Button>
        </>
      )}
      <AppAlertDialog
        title={dialog.title}
        description={dialog.description}
        onConfirm={dialog.onConfirm}
        dismiss={dialog.dismiss}
        open={dialog.open}
        onOpenChange={() => setDialog({ ...dialog, open: !dialog.open })}
      />
    </>
  );
};
