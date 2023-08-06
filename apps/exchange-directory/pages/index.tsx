import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { ensureNever } from '../utils';
import { useRouter } from 'next/router';

function listExchanges() {
  return fetch('https://api.coingecko.com/api/v3/exchanges?per_page=10', {
    headers: {
      accept: 'application/json',
    },
  });
}

type Exchange = {
  id: string;
  name: string;
  country: string;
  url: string;
  image: string;
  trust_score_rank: number;
};

type ExchangeList =
  | {
      status: ExchangeListStatus.Idle;
    }
  | {
      status: ExchangeListStatus.Loading;
    }
  | {
      status: ExchangeListStatus.Completed;
      data: Exchange[];
    }
  | {
      status: ExchangeListStatus.Failed;
      error: unknown;
    };

enum ExchangeListStatus {
  Idle,
  Loading,
  Completed,
  Failed,
}

export function Index() {
  const [exchangeList, setExchangeList] = useState<ExchangeList>({
    status: ExchangeListStatus.Idle,
  });

  useEffect(() => {
    setExchangeList({ status: ExchangeListStatus.Loading });
    // TODO: Abort fetch on unmount

    listExchanges()
      .then((response) => response.json())
      .then((data) => {
        setExchangeList({ status: ExchangeListStatus.Completed, data });
      })
      .catch((error) => {
        setExchangeList({ status: ExchangeListStatus.Failed, error });
      });
  }, []);

  const router = useRouter();

  if (exchangeList.status === ExchangeListStatus.Idle) {
    return null;
  }

  if (exchangeList.status === ExchangeListStatus.Loading) {
    return <div>Loading...</div>;
  }

  if (exchangeList.status === ExchangeListStatus.Failed) {
    return <div>Error: {exchangeList.error}</div>;
  }

  if (exchangeList.status === ExchangeListStatus.Completed) {
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
            className="hover focus-visible:bg-[hsl(var(--b2))] outline-none"
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

              <span className=''>{exchange.name}</span>
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

  // id: string;
  // name: string;
  // country: string;
  // url: string;
  // image: string;
  // trust_score_rank: number;

  ensureNever(exchangeList);
}

export default Index;
