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


delete from favs
where fk_pic = 5;
delete from pics_tags
where fk_pic = 5;
delete from pics
where pics.id = 5;

\copy (
select pics.id, pics.extention, array_agg(tags.name)
from pics
join pics_tags on pics.id = fk_pic
join tags on fk_tag = tags.id
group by pics.id) 
to '/mnt/Sata-SSD/output.csv' csv header;

select pics.id
from pics
join pics_tags on pics.id = fk_pic
join tags on fk_tag = tags.id
group by pics.id

-- show all who are not from confyUI
from pics
where created_at < '2025-09-26 11:12';

