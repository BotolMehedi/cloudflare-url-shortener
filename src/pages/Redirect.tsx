import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLinkByShortCode, recordClick } from "@/lib/links";

const Redirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shortCode) {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      try {
        const link = await getLinkByShortCode(shortCode);

        if (!link || (link.expires_at && Date.now() > new Date(link.expires_at).getTime()) || !link.is_active) {
          navigate("/", { replace: true });
          return;
        }

        // Record click (fire and forget)
        recordClick(link.id, document.referrer || undefined, navigator.userAgent);

        // Instant redirect
        window.location.replace(link.original_url);
      } catch {
        navigate("/", { replace: true });
      }
    })();
  }, [shortCode, navigate]);

  return null;
};

export default Redirect;
