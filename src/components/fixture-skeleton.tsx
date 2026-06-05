import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FixtureSkeleton() {
  return (
    <Card className="overflow-hidden backdrop-blur-md bg-white/5 border-white/10">
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center gap-3 w-1/3">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col items-center justify-center w-1/3 px-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-16 mt-2" />
          </div>
          <div className="flex flex-col items-center gap-3 w-1/3">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
