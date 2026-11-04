export type PublicSettings = {
  app_name: string;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
};

export type GeneralSettings = PublicSettings & {
  timezone: string;
  locale: string;
};

export type MailSettings = {
  host: string | null;
  port: number | null;
  username: string | null;
  has_password: boolean;
  encryption: string | null;
  from_address: string | null;
  from_name: string | null;
  reply_to_address: string | null;
};