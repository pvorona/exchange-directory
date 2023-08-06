import { useEffect, useState } from 'react';
import { Exchange, Loadable, LoadableStatus, ensureNever } from '../utils';
import { useRouter } from 'next/router';

function listExchanges(init?: RequestInit) {
  return fetch('https://api.coingecko.com/api/v3/exchanges?per_page=10', {
    headers: {
      accept: 'application/json',
    },
    ...init,
  });
}

type ExchangeList = Loadable<readonly Exchange[]>;

export function Index() {
  const [exchangeList, setExchangeList] = useState<ExchangeList>({
    status: LoadableStatus.Idle,
  });

  useEffect(() => {
    setExchangeList({ status: LoadableStatus.Loading });

    const controller = new AbortController();

    listExchanges({ signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        setExchangeList({ status: LoadableStatus.Completed, data });
      })
      .catch((error) => {
        setExchangeList({ status: LoadableStatus.Failed, error });
      });

    return () => {
      controller.abort();
    };
  }, []);

  const router = useRouter();

  if (exchangeList.status === LoadableStatus.Idle) {
    return null;
  }

  if (exchangeList.status === LoadableStatus.Loading) {
    return <div>Loading...</div>;
  }

  if (exchangeList.status === LoadableStatus.Failed) {
    return <div>Error: {exchangeList.error}</div>;
  }

  if (exchangeList.status === LoadableStatus.Completed) {
    return (
      <table className="table">
        <thead>
          <th>Name</th>
          <th>Country</th>
          <th>URL</th>
          <th>Trust Rank</th>
        </thead>
        {exchangeList.data.map((exchange) => (
          <tr
            key={exchange.id}
            className="hover focus-visible:bg-[hsl(var(--b2))] outline-none cursor-pointer"
            onClick={() => router.push(`/exchanges/${exchange.id}`)}
            onKeyDown={(event) => {
              if ('Enter' === event.key) {
                router.push(`/exchanges/${exchange.id}`);
              }
            }}
            tabIndex={0}
            role="link"
          >
            <td className="flex items-center">
              <div className="avatar mr-2">
                <div className="mask mask-squircle w-12 h-12">
                  <img src={exchange.image} alt="" />
                </div>
              </div>

              {exchange.name}
            </td>
            <td>{exchange.country}</td>
            <td>
              <a
                href={exchange.url}
                target="_blank"
                rel="noreferrer noopener"
                className="link"
              >
                {exchange.url}
              </a>
            </td>
            <td>{exchange.trust_score_rank}</td>
          </tr>
        ))}
      </table>
    );
  }

  ensureNever(exchangeList);
}

export default Index;
