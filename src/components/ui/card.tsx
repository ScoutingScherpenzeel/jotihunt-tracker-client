import * as React from 'react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'; // Import Collapsible components
import { ChevronDownIcon } from 'lucide-react';

// Update the context to pass both collapsible and open state
const CollapsibleContext = React.createContext({ collapsible: false, open: false });

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { collapsible?: boolean; defaultOpen?: boolean }>(
  ({ className, collapsible = false, defaultOpen = false, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen);

    return (
      <CollapsibleContext.Provider value={{ collapsible, open }}>
        <div ref={ref} className={cn('rounded-lg bg-card text-card-foreground card p-4', className)} {...props}>
          {collapsible ? (
            <Collapsible open={open} onOpenChange={setOpen}>
              {children}
            </Collapsible>
          ) : (
            children
          )}
        </div>
      </CollapsibleContext.Provider>
    );
  },
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { collapsible, open } = React.useContext(CollapsibleContext);

  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className, {
        'mb-4': !collapsible || open, // Add mb-4 if not collapsible or if open
      })}
      {...props}
    />
  );
});
CardHeader.displayName = 'CardHeader';
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
  const { collapsible, open } = React.useContext(CollapsibleContext);

  return collapsible ? (
    <div className="flex justify-between items-center">
      <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
      <CollapsibleTrigger asChild className="hover:bg-gray-100 rounded-sm cursor-pointer hover:ring-4 ring-gray-100 w-4 h-4">
        <ChevronDownIcon className={cn('transition-transform', { 'rotate-180': open })} />
      </CollapsibleTrigger>
    </div>
  ) : (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { collapsible } = React.useContext(CollapsibleContext);

  return collapsible ? <CollapsibleContent ref={ref} className={cn('pt-0', className)} {...props} /> : <div ref={ref} className={cn('pt-0', className)} {...props} />;
});
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
