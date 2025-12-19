select *
from tags
where id in (13,14,19,16);


SELECT *
FROM pics
WHERE bit_count(hash # B1001010100011010001110100011100110111001001001111110010111000010) < 5;

insert into favs (fk_user, fk_pic)
values (1, 8);

delete from favs
where fk_user = 1
and fk_pic = 8;

SELECT pics.id, pics.suffix
FROM pics
    left join pics_tags on pics.id = pics_tags.fk_pic
    left join tags on pics_tags.fk_tag = tags.id
group by pics.id, pics.suffix