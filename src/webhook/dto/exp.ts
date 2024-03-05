// Define a type for the data you want to store
type EventData = {
  id: number;
  name: string;
  dataMap: {
    name: string;
    icon: string;
  };
  objMap: {
    title: string;
    img: string;
  };
  // Add more properties as needed
};
export enum Events {
  TEST_CREATED = 'test_created',
  TEST_UPDATED = 'test_updated'
}
// Define the data associated with each event
const eventData: Record<Events, EventData> = {
  [Events.TEST_CREATED]: {
    id: 1,
    name: 'Test Created Event',
    dataMap: {
      name: 'Test Created Event',
      icon: 'icon-url',
    },
    objMap: {
      title: '',
      img: '',
    }
  },
  [Events.TEST_UPDATED]: {
    id: 2,
    name: 'Test Updated Event',
    dataMap: {
      name: 'Test Updated Event',
      icon: 'icon-url',
    },
    objMap: {
      title: 'Test Updated Event',
      img: 'icon-url',
    }
  }
};

// Define the enum


// Example usage:
const testCreatedEventData = eventData[Events.TEST_CREATED];
console.log('Test Created Event Data:', testCreatedEventData);

const testUpdatedEventData = eventData[Events.TEST_UPDATED];
console.log('Test Updated Event Data:', testUpdatedEventData);
