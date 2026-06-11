-- Triggers email Brevo via Edge Function send-email
-- À exécuter dans Supabase → SQL Editor après déploiement de la function.
--
-- 1) Définir les secrets CLI :
--    npx supabase secrets set EMAIL_WEBHOOK_SECRET="votre-secret-long-aleatoire"
--    npx supabase secrets set SITE_URL="https://www.residencelasmoras.com"
--
-- 2) Remplacer YOUR_WEBHOOK_SECRET par la MÊME valeur que EMAIL_WEBHOOK_SECRET (voir ci-dessous)
--
-- 3) npx supabase functions deploy send-email

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL
);

ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;

INSERT INTO public.app_secrets (key, value)
VALUES
  ('supabase_functions_url', 'https://niljvtfulfauijvwqfpo.supabase.co/functions/v1'),
  ('email_webhook_secret', 'K7xP2mN9qR4vL8wJ3sT6yH1fG0dA5bE8cZ==')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;

CREATE OR REPLACE FUNCTION public.invoke_send_email(payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  fn_url text;
  webhook_secret text;
BEGIN
  SELECT value INTO fn_url
  FROM public.app_secrets
  WHERE key = 'supabase_functions_url';

  SELECT value INTO webhook_secret
  FROM public.app_secrets
  WHERE key = 'email_webhook_secret';

  IF fn_url IS NULL OR webhook_secret IS NULL THEN
    RAISE WARNING 'send-email: configuration app_secrets manquante';
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := fn_url || '/send-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || webhook_secret
    ),
    body := payload
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_send_email_contact()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.invoke_send_email(
    jsonb_build_object(
      'type', 'contact',
      'record', jsonb_build_object(
        'id', NEW.id,
        'nom', NEW.nom,
        'email', NEW.email,
        'sujet', NEW.sujet,
        'message', NEW.message,
        'created_at', NEW.created_at
      )
    )
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_send_email_reservation_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.statut_reservation = 'demande' THEN
    PERFORM public.invoke_send_email(
      jsonb_build_object(
        'type', 'reservation_request',
        'record', jsonb_build_object(
          'id', NEW.id,
          'logement_id', NEW.logement_id,
          'client_nom', NEW.client_nom,
          'client_email', NEW.client_email,
          'client_telephone', NEW.client_telephone,
          'date_arrivee', NEW.date_arrivee,
          'date_depart', NEW.date_depart,
          'nombre_nuits', NEW.nombre_nuits,
          'montant_total', NEW.montant_total,
          'statut_reservation', NEW.statut_reservation,
          'notes', NEW.notes,
          'created_at', NEW.created_at
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_send_email_reservation_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.statut_reservation = 'demande'
     AND NEW.statut_reservation = 'confirmee' THEN
    PERFORM public.invoke_send_email(
      jsonb_build_object(
        'type', 'reservation_confirmed',
        'record', jsonb_build_object(
          'id', NEW.id,
          'logement_id', NEW.logement_id,
          'client_nom', NEW.client_nom,
          'client_email', NEW.client_email,
          'client_telephone', NEW.client_telephone,
          'date_arrivee', NEW.date_arrivee,
          'date_depart', NEW.date_depart,
          'nombre_nuits', NEW.nombre_nuits,
          'montant_total', NEW.montant_total,
          'statut_reservation', NEW.statut_reservation,
          'notes', NEW.notes,
          'created_at', NEW.created_at
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_contact_send_email ON public.contacts;
CREATE TRIGGER on_contact_send_email
AFTER INSERT ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.trigger_send_email_contact();

DROP TRIGGER IF EXISTS on_reservation_request_send_email ON public.reservations;
CREATE TRIGGER on_reservation_request_send_email
AFTER INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.trigger_send_email_reservation_insert();

DROP TRIGGER IF EXISTS on_reservation_confirmed_send_email ON public.reservations;
CREATE TRIGGER on_reservation_confirmed_send_email
AFTER UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.trigger_send_email_reservation_confirmed();
