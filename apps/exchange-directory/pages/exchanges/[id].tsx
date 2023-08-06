import { useRouter } from 'next/router';
import {
  Exchange,
  Loadable,
  LoadableStatus,
  ensureNever,
  ensureString,
} from '../../utils';
import Link from 'next/link';
import classNames from 'classnames';
import {
  TwitterIcon,
  RedditIcon,
  TelegramIcon,
  FacebookIcon,
} from '../../components';
import { useState, useEffect } from 'react';

async function getExchange(id: string, init?: RequestInit): Promise<Exchange> {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/exchanges/${id}`,
    {
      headers: {
        accept: 'application/json',
      },
      ...init,
    }
  );
  return response.json();
}

const labelClassName = 'font-bold pr-2 align-baseline whitespace-nowrap';

export default function ExchangeDetailsPage() {
  const router = useRouter();
  const [exchange, setExchange] = useState<Loadable<Exchange>>({
    status: LoadableStatus.Idle,
  });

  useEffect(() => {
    if (router.query.id === undefined) {
      return;
    }

    setExchange({ status: LoadableStatus.Loading });

    const controller = new AbortController();

    getExchange(ensureString(router.query.id), { signal: controller.signal })
      .then((data) => {
        setExchange({ status: LoadableStatus.Completed, data });
      })
      .catch((error) => {
        setExchange({ status: LoadableStatus.Failed, error });
      });

    return () => {
      controller.abort();
    };
  }, [router.query.id]);

  if (exchange.status === LoadableStatus.Idle) {
    return null;
  }

  if (exchange.status === LoadableStatus.Loading) {
    return (
      <span className="loading loading-spinner loading-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    );
  }

  if (exchange.status === LoadableStatus.Failed) {
    return <div>Error: {exchange.error}</div>;
  }

  if (exchange.status === LoadableStatus.Completed) {
    const {
      data: {
        name,
        country,
        trust_score_rank,
        image,
        year_established,
        description,
        telegram_url,
        facebook_url,
        reddit_url,
        twitter_handle,
      },
    } = exchange;

    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full sm:h-auto sm:w-[528px] flex flex-col items-center bg-base-200 p-8 rounded-lg">
          <div className="avatar mb-8">
            <div className="mask mask-squircle w-12 h-12">
              <img src={image} alt="" />
            </div>
          </div>

          <table className="w-full">
            <tbody>
              <tr>
                <td className={labelClassName}>Name</td>
                <td>{name}</td>
              </tr>

              {description?.length !== 0 && (
                <tr>
                  <td className={classNames(labelClassName, 'pt-2')}>
                    Description
                  </td>
                  <td className="pt-2">{description}</td>
                </tr>
              )}

              <tr>
                <td className={classNames(labelClassName, 'pt-2')}>Country</td>
                <td className="pt-2">{country}</td>
              </tr>

              <tr>
                <td className={classNames(labelClassName, 'pt-2')}>
                  Trust Rank
                </td>
                <td className="pt-2">{trust_score_rank}</td>
              </tr>

              <tr>
                <td className={classNames(labelClassName, 'pt-2')}>Year</td>
                <td className="pt-2">{year_established}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex mt-auto sm:mt-8 space-x-4">
            {twitter_handle && (
              <a href={`https://twitter.com/${twitter_handle}`}>
                <TwitterIcon />
              </a>
            )}

            {reddit_url && (
              <a href={reddit_url}>
                <RedditIcon />
              </a>
            )}

            {telegram_url && (
              <a href={telegram_url}>
                <TelegramIcon />
              </a>
            )}

            {facebook_url && (
              <a href={facebook_url}>
                <FacebookIcon />
              </a>
            )}
          </div>

          <Link href="/">
            <a className="btn btn-primary mx-auto mt-8 w-full">Back</a>
          </Link>
        </div>
      </div>
    );
  }

  ensureNever(exchange);
}
