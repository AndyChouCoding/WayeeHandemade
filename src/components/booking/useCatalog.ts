'use client';

import { useEffect, useState } from 'react';
import { bookingRequest, errorMessage, type Catalog, type Service, type Staff, type Tenant } from '@/lib/booking';

export function useCatalog() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; data?: Catalog; error?: string }>();
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      bookingRequest<Tenant>('studio', { signal: controller.signal }),
      bookingRequest<Service[]>('services', { signal: controller.signal }),
      bookingRequest<Staff[]>('staff', { signal: controller.signal }),
    ]).then(([tenant, services, staff]) => {
      if (!controller.signal.aborted) setResult({ attempt, data: { tenant, services, staff } });
    }).catch((error) => {
      if (!controller.signal.aborted) setResult({ attempt, error: errorMessage(error) });
    });
    return () => controller.abort();
  }, [attempt]);
  return { data: result?.attempt === attempt ? result.data : undefined, error: result?.attempt === attempt ? result.error : undefined, retry: () => setAttempt((n) => n + 1) };
}
