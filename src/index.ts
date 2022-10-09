//types
import type { AtomEffect } from "recoil";

//next router
import Router from "next/router";

const isClient = typeof window !== "undefined";

const queryMap = new Map<string, string>();

interface ISyncEffectArgs {
  queryName: string;
  type: "Number" | "String";
}

export const syncEffect =
  <T extends unknown>({ queryName, type }: ISyncEffectArgs): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    if (isClient) {
      const TypeFunc = window[type];
      const queryValue = getQueryValue(queryName);

      if (queryValue) {
        const typeChangeQueryValue = TypeFunc(queryValue) as any;

        if (typeChangeQueryValue) setSelf(typeChangeQueryValue);
      } else setSelf(null as any);
    }

    onSet((newValue) => {
      if (newValue === null) delete Router.query[queryName];
      else Router.query[queryName] = String(newValue);
      Router.push({ query: { ...Router.query } });
    });

    return () => {
      if (queryMap.size !== 0) queryMap.clear();
    };
  };

//getting value using queryName
const getQueryValue = (queryName: string) => {
  let queryValue = Router.query[queryName];

  if (!queryValue) {
    if (queryMap.size == 0) {
      getSearchQueryObject();
      getPathnameQueryObject();
    }
    queryValue = queryMap.get(queryName)!;
  }

  return queryValue;
};

//setting query data from pathname
const getPathnameQueryObject = () => {
  const queryNameFromPathname = Router.pathname.split("/");
  const queryValueFromPathname = location.pathname.split("/");

  for (let i = 0; i < queryValueFromPathname.length; i++) {
    if (queryNameFromPathname[i].includes("[")) {
      queryMap.set(
        queryNameFromPathname[i].replaceAll(/[\[\]']+/g, ""),
        queryValueFromPathname[i]
      );
    }
  }
};

//setting query data from search query
const getSearchQueryObject = () => {
  const queryArr = location.search.substring(1).split(/&|=/);

  for (let i = 0; i < queryArr.length; i += 2) {
    queryMap.set(queryArr[i], queryArr[i + 1]);
  }
};
