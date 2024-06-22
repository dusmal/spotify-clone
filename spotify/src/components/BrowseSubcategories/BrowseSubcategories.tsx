import React from 'react';
import { useEffect, useState } from 'react';
import { getCategoryPlaylist } from '../../api/spotifyApiClient';
import style from '../../assets/styles/browseSubcategories.module.scss';
import {Subcategories} from '../../types/types';

type Props = {
    onSubcategorySelect: (id: string) => void;
    subcategoryId: string;
};

const BrowseSubcategories = ({onSubcategorySelect, subcategoryId}: Props) => {
    const [subcategoriesPlaylists, setSubcategoriesPlaylists] = useState<Subcategories|null>(null);

    useEffect(()=>{
        const getPlaylists = async ()=>{
            const catPlaylist = await getCategoryPlaylist(subcategoryId);
            setSubcategoriesPlaylists(catPlaylist);
          }
        getPlaylists();
    }, []);

    return (
      <div className={style.backgroundColor}>
        <div className={style.browseSubcategoriesContainer}>
        {
            subcategoriesPlaylists && <div className={style.wrapper}>
                <h4 className={style.header}>{subcategoriesPlaylists.message}</h4>
                {subcategoriesPlaylists.playlists.items.map((el,i)=>{
                    return <div className={style.imageContainer} >
                            <img onClick={()=>onSubcategorySelect(el.id)} src={el.images[0].url} />
                        </div>
                })
                }
            </div>
        }
        </div>
      </div>
    );
  };
export default BrowseSubcategories;