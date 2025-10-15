export interface Race {
  race_id: string;
  race_name: string;
  race_number: number;
  meeting_id: string;
  meeting_name: string;
  category_id: string;
  advertised_start: {
    seconds: number;
  };
}

export interface RaceResponse {
  status: number;
  data: {
    next_to_go_ids: string[];
    race_summaries: Record<string, Race>;
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export const RACE_CATEGORIES: Category[] = [
  {
    id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
    name: 'Greyhound Racing',
    color: 'racing-greyhound'
  },
  {
    id: '161d9be2-e909-4326-8c2c-35ed71fb460b',
    name: 'Harness Racing',
    color: 'racing-harness'
  },
  {
    id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
    name: 'Horse Racing',
    color: 'racing-horse'
  }
];

export const NEDS_API_URL = 'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10';
