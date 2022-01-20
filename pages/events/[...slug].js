import Head from "next/head";
import Button from "../../components/ui/button";
import { getFilteredEvents } from "../../helpers/apiUtil";
import EventList from "../../components/events/EventList";
import ResultsTitle from "../../components/resultsTitle/resultsTitle";
import ErrorAlert from "../../components/errorAlert/errorAlert";

function filteredEventPage({ hasError, filterEvents, date }) {
  // const router = useRouter();
  // const filterData = router.query.slug;
  // if (!filterData) {
  //   return <p className="center">Loading...</p>;
  // }
  // const filterYear = +filterData[0];
  // const filterMonth = +filterData[1];

  if (hasError) {
    return (
      <div className="center">
        <ErrorAlert>
          <p>Invalid filter, Please adjust your values </p>
          <Button link="/events">Show All Events</Button>
        </ErrorAlert>
      </div>
    );
  }

  if (!filterEvents || filterEvents.length === 0) {
    return (
      <>
        <div className="center">
          <ErrorAlert>
            <p>No events found for chosen filter!</p>
            <Button link="/events">Show All Events</Button>
          </ErrorAlert>
        </div>
      </>
    );
  }
  let nDate = new Date(date.year, date.month - 1);
  return (
    <div>
      <Head>
        <title>Filter Events</title>
        <meta
          name="description"
          content={`All events for ${date.month}/ ${date.year}`}
        />
      </Head>
      <ResultsTitle date={nDate} />
      <EventList items={filterEvents} />
    </div>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  console.log("context", context);
  const filterData = params.slug;

  const filterYear = +filterData[0];
  const filterMonth = +filterData[1];

  if (
    isNaN(filterYear) ||
    isNaN(filterMonth) ||
    filterYear > 2025 ||
    filterMonth > 12 ||
    filterMonth < 0
  ) {
    return {
      props: { hasError: true },
      // notFound: true,
      // redirect: {
      //   destination: "/error",
      // },
    };
  }
  const filterEvents = await getFilteredEvents({
    year: filterYear,
    month: filterMonth,
  });
  return {
    props: { filterEvents, date: { year: filterYear, month: filterMonth } },
  };
}
export default filteredEventPage;