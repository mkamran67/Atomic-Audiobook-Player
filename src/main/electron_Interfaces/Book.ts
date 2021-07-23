export default interface Book {
  id: string;
  title: string | undefined;
  author?: string | undefined;
  description?: string | string[] | undefined;
  comments?: string[] | string;
  total_length: number;
  composers?: string[];
  date_published?: Date;
  publisher?: string;
  genre?: string[] | string;
  folder_path: string;
  parts_paths: string[];
  image_paths: string[];
  year?: number;
  series_name?: string;
  copyright?: string;
}
