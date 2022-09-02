import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocalStorage } from 'react-use';

import { Address } from '@/types/app';

const RECENT_N_ITEMS = 5;

interface RecentItem {
  id: Address;
  count: number;
}

type UseRecentReturn = [Array<Address>, (id: string) => void];
/**
 * Retrieve 'n' recent ids based on identifier sorted by popularity from local storage. Where n is RECENT_N_ITEMS constant.
 * Add new or increase count for existing id using log method
 * @param {string} key - storage key identifier
 * @param {excludeId=} excludeId - excluded id from recent items
 * @returns {UseRecentReturn} - array of recent ids list and log method to add/update passed down id to storage
 */
const useRecent = (key: string, excludeId?: Address) => {
  const [recentItems, setRecentItems] = useState<Array<Address>>([]);
  const [items, setItems] = useLocalStorage<RecentItem[]>(key, []);

  // sort items by popularity using count field
  const sortedItems = useMemo(() => items.sort((a, b) => b.count - a.count), [items]);

  // set recent item ids excluding item equal to 'excludeId' and limiting to RECENT_N_TIMES
  useEffect(() => {
    setRecentItems(
      sortedItems
        .filter((a) => a.id !== excludeId)
        .slice(0, RECENT_N_ITEMS)
        .map(({ id }) => id)
    );
  }, [sortedItems, excludeId]);

  // add new item or update count field of existing item to local storage
  const log = useCallback(
    (id: Address) => {
      const newItems = items.slice();
      const item = newItems.find((f) => f.id === id); // matched item
      if (item) {
        ++item.count;
      } else {
        newItems.push({ id, count: 1 });
      }
      // write to storage
      setItems(newItems);
    },
    [items, setItems]
  );
  return [recentItems, log] as UseRecentReturn;
};

export default useRecent;
