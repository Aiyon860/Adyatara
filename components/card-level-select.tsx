import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type CardImageProps = {
  /** URL gambar header card */
  image?: string;
  /** Alt text untuk gambar */
  imageAlt?: string;
  /** Teks badge (opsional, jika tidak diisi badge tidak ditampilkan) */
  badge?: string;
  /** Judul card */
  title?: string;
  /** Deskripsi card */
  description?: string;
  /** Label tombol (default: "Pilih Lokasi") */
  buttonText?: string;
  /** Handler saat tombol diklik */
  onSelect?: () => void;
};

export function CardImage({
  image = "https://placehold.co/600x400",
  imageAlt = "Event cover",
  badge,
  title = "Design systems meetup",
  description = "A practical talk on component APIs, accessibility, and shipping faster.",
  buttonText = "Pilih Lokasi",
  onSelect,
}: CardImageProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={image}
        alt={imageAlt}
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        {badge && (
          <CardAction>
            <Badge variant="secondary">{badge}</Badge>
          </CardAction>
        )}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={onSelect}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
